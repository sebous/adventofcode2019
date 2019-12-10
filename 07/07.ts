import path from "path";
import _ from "lodash";
import { permutations, readInputFile } from "../util";
import { intcodeComputer } from "../intcode";

function part1(input: string) {
    const inputProgram = input.split(',').map(Number);

    const output = permutations([0, 1, 2, 3, 4]).reduce((output: number, ampsPhase: number[]): number => {
        let amplifierOutput: number[] = []
        _.range(5).forEach(i => {
            let isFirstInput = true

            intcodeComputer(
                [...inputProgram],
                0,
                () => {
                    const input = isFirstInput ? ampsPhase[i] : (amplifierOutput[i - 1] || 0)
                    isFirstInput = false
                    return input
                },
                (op: number) => {
                    amplifierOutput[i] = op
                },
            );

        });
        return amplifierOutput[4] > output ? amplifierOutput[4] : output
    }, 0)
    return output;
}

(async () => {
    const input: string = await readInputFile(path.join(__dirname + '/data.txt'));
    const output1 = part1(input);

    console.log(output1);

    // const testInputData: string = await readInputFile(path.join(__dirname, '/data_test.txt'));
    // const testInput = testInputData.split(',').map(Number);
    // // console.log(testInput);
    // const testOutput = intCodeComputer(
    //     [...testInput],
    //     0,
    //     () => {
    //         const input = readline.question('>> INPUT:') || '1';
    //         return Number(input);
    //     },
    //     (op: number) => console.log(op),
    // );

    // console.log(testOutput);
})();
