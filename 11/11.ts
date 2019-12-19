import path from "path";
import { readInputFile } from "../util";
import { intcodeComputer, intcodeOptimizedComputer } from "../intcode";

enum Color {
    BLACK,
    WHITE,
}

enum Rotate {
    LEFT,
    RIGHT,
}

enum Direction {
    UP,
    RIGHT,
    BOTTOM,
    LEFT,
}

interface Coords {
    x: number;
    y: number;
}

interface Pixel {
    color: Color;
    painted: boolean;
}

const defaultPixel = (): Pixel => ({ color: Color.BLACK, painted: false });

function getCoords(coords: string) {
    const [x, y] = coords.split(',').map(Number)
    return <Coords>{ x, y };
}

function nextDirection(current: Direction, instruction: Rotate): Direction {
    if (instruction === Rotate.RIGHT) {
        if (current === Direction.LEFT) return Direction.UP;
        return (current + 1) as Direction;
    } else {
        if (current === Direction.UP) return Direction.LEFT;
        return (current - 1) as Direction;
    }
}

function nextPosition(current: string, nextDirection: Direction) {
    const coords = getCoords(current);
    switch (nextDirection) {
        case Direction.UP: {
            coords.y += 1;
            break;
        }
        case Direction.RIGHT: {
            coords.x += 1;
            break;
        }
        case Direction.BOTTOM: {
            coords.y -= 1;
            break;
        }
        case Direction.LEFT: {
            coords.x -= 1;
            break;
        }
    }
    const { x, y } = coords;
    return `${x},${y}`;
}

function partOne(program: number[]) {
    let currentPosition = '0,0';
    let currentDirection: Direction = Direction.UP;
    const grid: { [key: string]: Pixel } = {}

    let isFirstOutput = true;
    // console.log(Object.keys(Direction));

    intcodeOptimizedComputer(
        [...program],
        0,
        () => {
            if (currentPosition in grid) {
                return grid[currentPosition].color;
            }
            return Color.BLACK;
        },
        (output: number) => {
            if (Object.keys(grid).length === 42) {
                console.log('now');
            }
            console.log(`total tiles: ${Object.keys(grid).length}`);
            console.log(`painted tiles: ${Object.entries(grid).filter(([key, pixel]) => pixel.painted).length}`);
            if (isFirstOutput) {
                if (currentPosition in grid) {
                    if (output !== grid[currentPosition].color) {
                        grid[currentPosition].color = output;
                        grid[currentPosition].painted = true;
                    }
                } else {
                    const nexPixel = defaultPixel();
                    if (output === Color.WHITE) {
                        nexPixel.color = output;
                        nexPixel.painted = true;
                    }
                    grid[currentPosition] = nexPixel;
                }
            } else {
                currentDirection = nextDirection(currentDirection, output);
                currentPosition = nextPosition(currentPosition, currentDirection);
                // console.log(`next move: ${currentDirection}, ${currentPosition}`);
            }
            isFirstOutput = !isFirstOutput;

        },
    )
    // Object.entries(grid).forEach(([key, pixel]) => console.log(`${key}, c: ${pixel.color}, p: ${pixel.painted}`));
    console.log(`grid length: ${Object.entries(grid).filter(([key, pixel]) => pixel.painted).length}`);
}




(async () => {
    const input: string = await readInputFile(path.join(__dirname, '/data.txt'));
    const inputProgram = input.split(',').map(Number);
    await partOne(inputProgram);
})()