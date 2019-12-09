const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const input = fs.readFileSync(path.join(__dirname, './data.txt')).toString().split('\n');
const [firstWire, secondWire] = input.map(str => str.split(','));

const grid = {};

let currentPos = '0,0';
let currentStep = 1;

function drawPath(movements = [], wireNumber) {
    movements.forEach(movement => {
        const direction = movement[0];
        const value = parseInt(movement.replace(direction, ''), 10);
        const [x, y] = currentPos.split(',').map(c => parseInt(c, 10));
        switch (direction) {
            case 'R': {
                _.range(x + 1, value + x + 1).forEach(c => writePosition(c, y, wireNumber));
                break;
            }
            case 'U': {
                _.range(y + 1, value + y + 1).forEach(c => writePosition(x, c, wireNumber));
                break;
            }
            case 'L': {
                for (let c = x - 1; c >= x - value; c--) {
                    writePosition(c, y, wireNumber);
                }
                break;
            }
            case 'D': {
                for (let c = y - 1; c >= y - value; c--) {
                    writePosition(x, c, wireNumber);
                }
                break;
            }
        }
    });
    // reset position
    currentPos = '0,0';
    currentStep = 1;
}

function writePosition(x, y, wireNumber) {
    if (grid[`${x},${y}`]) {
        grid[`${x},${y}`][`${wireNumber}`] = 1;
    } else {
        grid[`${x},${y}`] = {};
        grid[`${x},${y}`][`${wireNumber}`] = 1;
    }

    if (!grid[`${x},${y}`][`${wireNumber}-step`]) {
        grid[`${x},${y}`][`${wireNumber}-step`] = currentStep;
    }

    currentPos = `${x},${y}`;
    currentStep += 1;
}

drawPath(firstWire, 1);
drawPath(secondWire, 2);

function calculatePart1() {
    const intersections = Object.keys(grid).filter(key => !!grid[key]['1'] && !!grid[key]['2']);

    const distances = intersections.map(key => {
        const [x, y] = key.split(',');
        return Math.abs(Number(x)) + Math.abs(Number(y));
    });

    const minimalDistance = _.min(distances);
    console.log(minimalDistance);
}
calculatePart1();

function calculatePart2() {
    const intersections = Object.entries(grid)
        .filter(([key, val]) => !!grid[key]['1'] && !!grid[key]['2'])
        .map(([key, val]) => Number(val['1-step']) + Number(val['2-step']));

    const minimalSteps = _.min(intersections);
    console.log(minimalSteps);
}
calculatePart2();
