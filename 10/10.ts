import path from "path";
import _ from "lodash";
import { readInputFile } from "../util";

interface Coords {
    x: number;
    y: number;
}

interface Space {
    map: SpaceMap;
    height: number;
    width: number;
}

type SpaceMap = { [key: string]: Point };

enum Point {
    EMPTY = '.',
    ASTEROID = '#',
}

const coord = (x: number, y: number) => `${x},${y}`;

const getCoords = (str: string): Coords => {
    const [x, y] = str.split(',');
    return { x: Number(x), y: Number(y) };
}

/**
 * Is C between A and B?
 */
function isBetween(C: Coords, A: Coords, B: Coords) {
    return (distance(A, C) + distance(B, C)) === distance(A, B);
}

function distance(A: Coords, B: Coords) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
}

function createSpace(rawMapData: string): Space {
    const map: SpaceMap = {};
    rawMapData
        .split('\n')
        .forEach((row, y) => row.split('').forEach((point, x) => (
            map[coord(x, y)] = point === Point.EMPTY ? Point.EMPTY : Point.ASTEROID
        )));
    const height = rawMapData.split('\n').length;
    const width = rawMapData.split('\n')[0].split('').length;
    return {
        map,
        height,
        width,
    }
}

function partOne(space: Space) {
    const asteroids = Object.entries(space.map).filter(([coord, point]) => point === Point.ASTEROID);
    const stationCandidates = asteroids
        .map(([coord, point]) => {
            const otherAsteroids = asteroids.filter(([c]) => c !== coord);
            const visible = otherAsteroids.filter(([currCoord, currPoint]) => {
                const remainingAsteroids = otherAsteroids.filter(([c]) => c !== currCoord);
                return remainingAsteroids.every(ast => !isBetween(getCoords(ast[0]), getCoords(coord), getCoords(currCoord)));
            });
            return [coord, visible.length];
        });
    const bestCandidate = _.maxBy(stationCandidates, candidate => candidate[1]);
    console.log(bestCandidate);
}

(async () => {
    const rawMapData: string = await readInputFile(path.join(__dirname, '/data.txt'));
    const space = createSpace(rawMapData);
    partOne(space);
    tests();
})()


function tests() {
    const B = '1,0';
    const A = '3,4';

}