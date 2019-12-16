import path from "path";
import _ from "lodash";
import { readInputFile } from "../util";

interface Coords {
    x: number;
    y: number;
}

interface Position extends Coords {
    distance: number;
    angle: number;
}

interface Space {
    map: SpaceMap;
    height: number;
    width: number;
}

type SpaceMap = { [key: string]: Point };
type SpacePositionMap = { [key: string]: Position };

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
function isBetween(C: string, A: string, B: string) {
    const tolerance = 0.000001;
    const c = getCoords(C);
    const a = getCoords(A);
    const b = getCoords(B);
    return Math.abs(distance(a, b) - distance(b, c) - distance(a, c)) <= tolerance;
}

function distance(A: Coords, B: Coords) {
    return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
}

function calculateAngle(target: string, center: string) {
    const targetCoords = getCoords(target);
    const centerCoords = getCoords(center);

    const longSide = Math.sqrt(Math.pow(targetCoords.x - centerCoords.x, 2) + Math.pow(targetCoords.y - centerCoords.y, 2));
    const angleAlpha = targetCoords.x / longSide;
    const degrees = angleAlpha * (180 / Math.PI);
    return degrees;
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
    const stationCandidates: [string, number][] = asteroids
        .map(([coord, point]) => {
            const otherAsteroids = asteroids.filter(([c]) => c !== coord);
            const visible = otherAsteroids.filter(([currCoord, currPoint]) => {
                const remainingAsteroids = otherAsteroids.filter(([c]) => c !== currCoord);
                return remainingAsteroids.every(ast => !isBetween(ast[0], coord, currCoord));
            });
            return [coord, visible.length];
        });
    const bestCandidate: [string, number] | undefined = _.maxBy(stationCandidates, candidate => candidate[1]);
    if (!bestCandidate) throw new Error('nothing found');
    console.log(bestCandidate);
    return bestCandidate;
}

function partTwo(space: Space, [stationCoords, asteroidCount]: [string, number]) {
    const asteroids = Object.entries(space.map)
        .filter(([coord, point]) => point === Point.ASTEROID)
        .filter(([coord]) => coord !== stationCoords)
        .map(([coord]) => (<Position>{
            x: getCoords(coord).x,
            y: getCoords(coord).y,
            distance: distance(getCoords(stationCoords), getCoords(coord)),
            angle: calculateAngle(coord, stationCoords),
        }));

    const asteroidMap: SpacePositionMap = {};
    asteroids.forEach(ast => asteroidMap[`${ast.x}, ${ast.y}`] = ast);
    console.log(asteroidMap);

    let asteroidCounter = 1;
    let currentAngle = 0;
    while (Object.keys(asteroidMap).length > 0) {
        const currentTargets = Object.entries(asteroidMap).filter(([coord, pos]) => pos.angle === currentAngle);
        const closestTarget = _.minBy(currentTargets, (([coord, pos]) => pos.distance));

        if (!closestTarget) throw new Error('wrong next target calculation');

        // console.log(`fire in the hole: ${closestTarget[0]}, count: ${asteroidCounter}`);
        delete asteroidMap[closestTarget[0]];
        asteroidCounter += 1;

        // find next target angle
        const remainingTargets = Object.entries(asteroidMap);
        const nextAsteroid = _.minBy(remainingTargets, (([coord, pos]) => {
            // if nothing left under 360deg, find first in next round
            if (!remainingTargets.some(([coord, pos]) => pos.angle > currentAngle)) {
                return pos.angle;
            }
            // get closest angle
            return pos.angle - currentAngle;
        }));
        if (!nextAsteroid) throw new Error('no asteroids left??');

        currentAngle = nextAsteroid[1].angle;
    }
}

(async () => {
    const rawMapData: string = await readInputFile(path.join(__dirname, '/data.txt'));
    const space = createSpace(rawMapData);
    const station = partOne(space);
    partTwo(space, station);
    // tests();
})()


function tests() {
    const B = '1,0';
    const A = '3,4';

    console.log(isBetween('2,2', '1,0', '3,4'));
    console.log(isBetween('3,2', '1,0', '4,3'));

}