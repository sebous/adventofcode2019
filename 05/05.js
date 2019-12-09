const path = require('path');
const fs = require('fs');
const readline = require('readline-sync');


// const input = fs.readFileSync(path.join(__dirname, './data_test.txt'))
const inputData = fs.readFileSync(path.join(__dirname, './data.txt'))
    .toString()
    .split(',')
    .map(num => Number(num));

const OpCode = {
    ADD: 1,
    MULTIPLY: 2,
    INPUT: 3,
    LOG: 4,
    JUMP_IF_TRUE: 5,
    JUMP_IF_FALSE: 6,
    LESS_THAN: 7,
    EQUALS: 8,
    HALT: 99,
};

const ParamMode = {
    POSITION: 0,
    IMMEDIATE: 1,
};

const isUndefined = (val) => typeof val === 'undefined';
const getParamMode = (paramMode) => paramMode === 0 || isUndefined(paramMode) ? 0 : 1;

const resolveParam = (mode, memory, paramMemoryIndex) => {
    const paramMode = getParamMode(mode);

    if (paramMode === ParamMode.POSITION) {
        return memory[memory[paramMemoryIndex]];
    } else if (paramMode === ParamMode.IMMEDIATE) {
        return memory[paramMemoryIndex];
    }
}

function extractInstruction(instruction = 123) {
    const instStr = String(instruction);
    const paramModes = [];
    if (instStr.length === 1) {
        return { opCode: Number(instStr[instStr.length - 1]), modes: paramModes };
    } else if (instStr.length === 2) {
        // console.log('instruction length 2 ->>> Error');
        return { opCode: Number(instruction), modes: paramModes };
    } else if (instStr.length > 2) {
        const chars = instStr.split('');
        chars.pop();
        chars.pop();
        for (let i = chars.length - 1; i >= 0; i--) {
            if (typeof chars[i] !== 'undefined') paramModes.push(Number(chars[i]));
        }
        paramModes.push(0);
        return { opCode: Number(instStr[instStr.length - 1]), modes: paramModes };
    }
}

function runInstr(input) {
    let memoryIndex = 0;
    const memory = [...input];

    while (memoryIndex <= memory.length - 1) {
        const instruction = extractInstruction(memory[memoryIndex]);
        const { modes, opCode } = instruction;
        const firstParam = resolveParam(modes[0] || 0, memory, memoryIndex + 1);
        const secondParam = resolveParam(modes[1] || 0, memory, memoryIndex + 2);

        switch (opCode) {
            case OpCode.ADD: {
                memory[memory[memoryIndex + 3]] = firstParam + secondParam;
                memoryIndex += 4;
                break;
            }
            case OpCode.MULTIPLY: {
                memory[memory[memoryIndex + 3]] = firstParam * secondParam;
                memoryIndex += 4;
                break;
            }
            case OpCode.INPUT: {
                const promptInput = readline.question('>>INPUT');
                if (isNaN(Number(promptInput))) throw new Error('input is not a number');
                const targetIndex = memory[memoryIndex + 1];
                memory[targetIndex] = Number(promptInput);
                memoryIndex += 2;
                break;
            }
            case OpCode.LOG: {
                console.log(memory[memory[memoryIndex + 1]]);
                memoryIndex += 2;
                break;
            }
            case OpCode.JUMP_IF_TRUE: {
                if (firstParam !== 0) memoryIndex = secondParam;
                else memoryIndex += 3;
                break;
            }
            case OpCode.JUMP_IF_FALSE: {
                if (firstParam === 0) memoryIndex = secondParam;
                else memoryIndex += 3;
                break;
            }
            case OpCode.LESS_THAN: {
                memory[memory[memoryIndex + 3]] = firstParam < secondParam ? 1 : 0;
                memoryIndex += 4;
                break;
            }
            case OpCode.EQUALS: {
                memory[memory[memoryIndex + 3]] = firstParam === secondParam ? 1 : 0;
                memoryIndex += 4;
                break;
            }
            case OpCode.HALT: {
                return;
            }
        }
    }
}

runInstr(inputData);


