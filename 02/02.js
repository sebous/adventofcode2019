const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, './data.txt'))
    .toString()
    .trim()
    .split(',')
    .map(num => parseInt(num, 10));

const originalInput = [...input];

function calculatePart1() {
    input[1] = 12;
    input[2] = 2;

    let opcodeIndex = 0;

    while (opcodeIndex <= input.length - 1) {
        if (input[opcodeIndex] === 99) {
            console.log('99 opcode hit, ending..');
            break;
        } else if (input[opcodeIndex] === 1) {
            const sum = input[input[opcodeIndex + 1]] + input[input[opcodeIndex + 2]];
            input[input[opcodeIndex + 3]] = sum;
        } else if (input[opcodeIndex] === 2) {
            const multiplied = input[input[opcodeIndex + 1]] * input[input[opcodeIndex + 2]];
            input[input[opcodeIndex + 3]] = multiplied;
        } else {
            console.log('error wrong number');
            break;
        }
        opcodeIndex += 4;
    }

    console.log('part 1', input[0]);
}

function calculatePart2() {
    const TARGET_VALUE = 19690720;

    function computePair(first, second) {
        let index = 0;
        const memory = [...originalInput];
        memory[1] = first;
        memory[2] = second;
        while (memory[index] !== 99) {
            switch (memory[index]) {
                case 1: {
                    memory[memory[index + 3]] = memory[memory[index + 1]] + memory[memory[index + 2]];
                    break;
                }
                case 2: {
                    memory[memory[index + 3]] = memory[memory[index + 1]] * memory[memory[index + 2]];
                    break;
                }
            }
            index += 4;
        }
        return memory[0];
    }

    for (let x1 = 0; x1 < 100; x1++) {
        for (let x2 = 0; x2 < 100; x2++) {
            const result = computePair(x1, x2);
            if (result === TARGET_VALUE) {
                console.log('part 2', 100 * x1 + x2);
            }
        }
    }

}
calculatePart1();
calculatePart2();