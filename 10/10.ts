import path from "path";
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

function createMap(rawMapData: string) {
    const map: SpaceMap = {};
    rawMapData
        .split('\n')
        .forEach((row, y) => row.split('').forEach((point, x) => (
            map[coord(x, y)] = point === Point.EMPTY ? Point.EMPTY : Point.ASTEROID
        )));
    return map;
}

function partOne(map: SpaceMap) {

}





(async () => {
    const rawMapData: string = await readInputFile(path.join(__dirname, '/data.txt'));
    const map = createMap(rawMapData);
    console.log(map);

})()