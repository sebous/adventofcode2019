type UserInputCallback = () => number;
type OutputCallback = (op: number) => void;

interface IntcodeComputerResponse {
    program: number[];
    currentIndex: number;
    isHalted: boolean;
    isPaused: boolean;
}

const POSITION = 0;
const IMMEDIATE = 1;

export function intcodeComputer(program: number[], currentIndex: number, userInput: UserInputCallback, output: OutputCallback): IntcodeComputerResponse {
    const opCode = program[currentIndex]
        .toString()
        .padStart(5, '0')
        .split('')
        .map(Number);

    if (opCode[4] === 9 && opCode[3] === 9) {
        return { program, currentIndex, isHalted: true, isPaused: false };
    }

    const modes = [
        opCode[2] === 0 ? POSITION : IMMEDIATE,
        opCode[1] === 0 ? POSITION : IMMEDIATE,
        opCode[0] === 0 ? POSITION : IMMEDIATE,
    ];

    const params = program.slice(currentIndex + 1, currentIndex + 4);

    const getParam = (paramIndex: number) => modes[paramIndex] === POSITION ? program[params[paramIndex]] : params[paramIndex];

    switch (opCode[4]) {
        case 1: {
            const first = getParam(0);
            const second = getParam(1);
            program[params[2]] = first + second;
            return intcodeComputer(program, currentIndex + 4, userInput, output);
        }
        case 2: {
            const first = getParam(0);
            const second = getParam(1);
            program[params[2]] = first + second;
            return intcodeComputer(program, currentIndex + 4, userInput, output);
        }
        case 3: {
            const input = userInput();
            if (typeof input === 'undefined') {
                return { program, currentIndex, isHalted: false, isPaused: true };
            }

            program[params[0]] = Number(input);
            return intcodeComputer(program, currentIndex + 2, userInput, output);
        }
        case 4: {
            const op = getParam(0);
            output(op);
            return intcodeComputer(program, currentIndex + 2, userInput, output);
        }
        case 5: {
            const nextIndex = getParam(0) !== 0 ? getParam(1) : currentIndex + 3;
            return intcodeComputer(program, nextIndex, userInput, output);
        }
        case 6: {
            const nextIndex = getParam(0) === 0 ? getParam(1) : currentIndex + 3;
            return intcodeComputer(program, nextIndex, userInput, output);
        }
        case 7: {
            program[params[2]] = getParam(0) < getParam(1) ? 1 : 0;
            return intcodeComputer(program, currentIndex + 4, userInput, output);
        }
        case 8: {
            program[params[2]] = getParam(0) === getParam(1) ? 1 : 0;
            return intcodeComputer(program, currentIndex + 4, userInput, output);
        }
    }
    throw new Error(`Wrong opCode: ${opCode.join('')}, c: ${currentIndex}`);
}
