import path from "path";
import _ from "lodash";
import { permutations, readInputFile } from "../util";
import { intcodeComputer } from "../intcode";

function part1(input: string) {
    const inputProgram = input.split(',').map(Number);

    const output = permutations([0, 1, 2, 3, 4]).reduce((output: number, ampsPhase: number[]): number => {
        let amplifierOutput: number[] = []
        _.range(5).forEach(i => {
            let isFirstInput = true;

            intcodeComputer(
                [...inputProgram],
                0,
                () => {
                    const input = isFirstInput ? ampsPhase[i] : amplifierOutput[i - 1] || 0;
                    isFirstInput = false;
                    return input;
                },
                (op: number) => {
                    amplifierOutput[i] = op;
                },
            );

        });
        return amplifierOutput[4] > output ? amplifierOutput[4] : output;
    }, 0)
    return output;
}

interface Amplifier {
    program: number[];
    currentIndex: number;
    input: number | undefined;
    firstI: boolean;
    secondI: boolean;
    output: number;
}

function part2(program: number[]): number {
    return permutations([5, 6, 7, 8, 9]).reduce((output: number, phase: number[]): number => {
        const amps = _.range(5).map(() => (
            <Amplifier>{
                program,
                currentIndex: 0,
                input: undefined,
                firstI: true,
                secondI: true,
                output: 0,
            }
        ));

        while (true) {
            let halt = false
            for (let i = 0; i < 5; i++) {
                const response = intcodeComputer(
                    [...amps[i].program],
                    amps[i].currentIndex,
                    () => {
                        if (amps[i].firstI) {
                            amps[i].firstI = false;

                            return phase[i];
                        }

                        if (i === 0 && amps[i].secondI) {
                            amps[i].secondI = false;

                            return 0;
                        }

                        const input = amps[i].input;
                        amps[i].input = undefined;

                        return input;
                    },
                    (op: number) => {
                        amps[i === 4 ? 0 : i + 1].input = op;
                        amps[i].output = op;
                    },
                );

                if (response.isHalted) {
                    halt = true;
                }

                amps[i] = { ...amps[i], program: response.program, currentIndex: response.currentIndex };
            }

            if (halt) {
                break;
            }
        }

        return amps[4].output > output ? amps[4].output : output
    }, 0)
}

(async () => {
    const input: string = await readInputFile(path.join(__dirname + '/data.txt'));
    const output1 = part1(input);

    console.log(output1);

    const input2: string = await readInputFile(path.join(__dirname, '/data2.txt'));
    const output2 = part2(input2.split(',').map(Number));

    console.log(output2);
})();
