type InputFn = () => number | undefined;
type OutputFn = (op: number) => void;

interface IntcodeComputerResponse {
    program: number[];
    currentIndex: number;
    isHalted: boolean;
    isPaused: boolean;
}

const POSITION = 0;
const IMMEDIATE = 1;

export function intcodeComputer(program: number[], currentIndex: number, userInput: InputFn, output: OutputFn): IntcodeComputerResponse {
    const opCode = program[currentIndex]
        .toString()
        .padStart(5, '0')
        .split('')
        .map(Number);

    if (opCode[4] === 9 && opCode[3] === 9) {
        return { program: program, currentIndex, isHalted: true, isPaused: false }
    }

    const modes = [
        opCode[2] === 0 ? POSITION : IMMEDIATE,
        opCode[1] === 0 ? POSITION : IMMEDIATE,
        opCode[0] === 0 ? POSITION : IMMEDIATE,
    ]

    const params = program.slice(currentIndex + 1, currentIndex + 4);

    const getParam = (paramIndex: number) => modes[paramIndex] === POSITION ? program[params[paramIndex]] : params[paramIndex];

    if (opCode[4] === 1) {
        program[params[2]] = getParam(0) + getParam(1);

        return intcodeComputer(program, currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 2) {
        program[params[2]] = getParam(0) * getParam(1);

        return intcodeComputer(program, currentIndex + 4, userInput, output)
    }

    if (opCode[4] === 3) {
        const input = userInput()
        if (typeof input === "undefined") {
            return { program: program, currentIndex, isHalted: false, isPaused: true }
        }

        program[params[0]] = input

        return intcodeComputer(program, currentIndex + 2, userInput, output)
    }

    if (opCode[4] === 4) {
        const op = getParam(0);
        output(op);
        return intcodeComputer(program, currentIndex + 2, userInput, output);
    }

    if (opCode[4] === 5) {
        const nextIndex = getParam(0) !== 0 ? getParam(1) : currentIndex + 3;
        return intcodeComputer(program, nextIndex, userInput, output);
    }

    if (opCode[4] === 6) {
        const nextIndex = getParam(0) === 0 ? getParam(1) : currentIndex + 3;
        return intcodeComputer(program, nextIndex, userInput, output);
    }

    if (opCode[4] === 7) {
        program[params[2]] = getParam(0) < getParam(1) ? 1 : 0;
        return intcodeComputer(program, currentIndex + 4, userInput, output);
    }

    if (opCode[4] === 8) {
        program[params[2]] = getParam(0) === getParam(1) ? 1 : 0;
        return intcodeComputer(program, currentIndex + 4, userInput, output);
    }

    throw new Error("Something went wrong." + opCode.join("") + "c: " + currentIndex)
}
