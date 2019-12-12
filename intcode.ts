type InputFn = () => number | undefined;
type OutputFn = (op: number) => void;

interface IntcodeComputerResponse {
    program: number[];
    currentIndex: number;
    isHalted: boolean;
    isPaused: boolean;
}

interface IntcodeComputerState {
    program: number[];
    currentIndex: number;
    relativeBase: number;
}

const POSITION = 0;
const IMMEDIATE = 1;
const RELATIVE = 2;

let relativeBase = 0;

export function intcodeComputer(program: number[], currentIndex: number, userInput: InputFn, output: OutputFn): IntcodeComputerResponse {
    const opCode = program[currentIndex]
        .toString()
        .padStart(5, '0')
        .split('')
        .map(Number);
    console.log(process.memoryUsage());
    // console.log(opCode, currentIndex, relativeBase);

    if (opCode[4] === 9 && opCode[3] === 9) {
        return { program: program, currentIndex, isHalted: true, isPaused: false };
    }

    const modes = [
        opCode[2],
        opCode[1],
        opCode[0],
    ]

    const params = program.slice(currentIndex + 1, currentIndex + 4).map(n => n || 0);

    const getParam = (paramIndex: number) => {
        if (modes[paramIndex] === POSITION) {
            return program[params[paramIndex]] || 0;
        }
        if (modes[paramIndex] === IMMEDIATE) {
            return params[paramIndex];
        }
        if (modes[paramIndex] === RELATIVE) {
            return program[params[paramIndex] + relativeBase] || 0;
        }

        throw new Error('wrong mode' + modes[paramIndex]);
    };

    const thirdParam = modes[2] === RELATIVE ? relativeBase + params[2] : params[2];

    if (opCode[4] === 1) {
        program[thirdParam] = getParam(0) + getParam(1);

        return intcodeComputer([...program], currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 2) {
        program[thirdParam] = getParam(0) * getParam(1);

        return intcodeComputer(program, currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 3) {
        const input = userInput()
        if (typeof input === "undefined") {
            return { program: [...program], currentIndex, isHalted: false, isPaused: true }
        }

        program[thirdParam] = input

        return intcodeComputer([...program], currentIndex + 2, userInput, output)
    }

    if (opCode[4] === 4) {
        const op = getParam(0);
        output(op);
        return intcodeComputer([...program], currentIndex + 2, userInput, output);
    }

    if (opCode[4] === 5) {
        const nextIndex = getParam(0) !== 0 ? getParam(1) : currentIndex + 3;
        return intcodeComputer([...program], nextIndex, userInput, output);
    }

    if (opCode[4] === 6) {
        const nextIndex = getParam(0) === 0 ? getParam(1) : currentIndex + 3;
        return intcodeComputer([...program], nextIndex, userInput, output);
    }

    if (opCode[4] === 7) {
        program[thirdParam] = getParam(0) < getParam(1) ? 1 : 0;
        return intcodeComputer([...program], currentIndex + 4, userInput, output);
    }

    if (opCode[4] === 8) {
        program[thirdParam] = getParam(0) === getParam(1) ? 1 : 0;
        return intcodeComputer([...program], currentIndex + 4, userInput, output);
    }

    if (opCode[4] === 9 && opCode[3] === 0) {
        relativeBase += getParam(0);
        return intcodeComputer([...program], currentIndex + 2, userInput, output);
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}

export function intcodeOptimizedComputer(inputProgram: number[], currentIndex: number, userInput: InputFn, output: OutputFn) {
    const opCode = (program: number[], currentIndex: number) => program[currentIndex]
        .toString()
        .padStart(5, '0')
        .split('')
        .map(Number);
    // console.log(process.memoryUsage());
    // console.log(opCode, currentIndex, relativeBase);

    const is99 = (op: number[]) => op[4] === 9 && op[3] === 3;

    let state: IntcodeComputerState = {
        program: [...inputProgram],
        currentIndex,
        relativeBase: 0,
    }

    while (!is99(opCode(state.program, state.currentIndex))) {
        const { currentIndex, program, relativeBase } = state;

        const op = opCode(program, currentIndex);
        const modes = [
            op[2],
            op[1],
            op[0],
        ]

        const params = program.slice(currentIndex + 1, currentIndex + 4).map(n => n || 0);

        const getParam = (paramIndex: number) => {
            if (modes[paramIndex] === POSITION) {
                return program[params[paramIndex]] || 0;
            }
            if (modes[paramIndex] === IMMEDIATE) {
                return params[paramIndex];
            }
            if (modes[paramIndex] === RELATIVE) {
                return program[params[paramIndex] + relativeBase] || 0;
            }

            throw new Error('wrong mode' + modes[paramIndex]);
        };

        const thirdParam = modes[2] === RELATIVE ? relativeBase + params[2] : params[2];

        if (op[4] === 1) {
            state.program[thirdParam] = getParam(0) + getParam(1);
            state.currentIndex += 4;
        }

        if (op[4] === 2) {
            state.program[thirdParam] = getParam(0) * getParam(1);
            state.currentIndex += 4;
        }

        if (op[4] === 3) {
            const input = userInput()
            if (!input) return;
            state.program[thirdParam] = input
            state.currentIndex += 2;
        }

        if (op[4] === 4) {
            const op = getParam(0);
            output(op);
            state.currentIndex += 2;
        }

        if (op[4] === 5) {
            const nextIndex = getParam(0) !== 0 ? getParam(1) : currentIndex + 3;
            state.currentIndex = nextIndex;
        }

        if (op[4] === 6) {
            const nextIndex = getParam(0) === 0 ? getParam(1) : currentIndex + 3;
            state.currentIndex = nextIndex;
        }

        if (op[4] === 7) {
            state.program[thirdParam] = getParam(0) < getParam(1) ? 1 : 0;
            state.currentIndex += 4;
        }

        if (op[4] === 8) {
            state.program[thirdParam] = getParam(0) === getParam(1) ? 1 : 0;
            state.currentIndex += 4;
        }

        if (op[4] === 9 && op[3] === 0) {
            state.relativeBase += getParam(0);
            state.currentIndex += 2;
        }
    }
}
