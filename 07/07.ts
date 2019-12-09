import path from "path";
import _ from "lodash";
import readline from "readline-sync";
import { permutations, readInputFile } from "../util";
import { intcodeComputer } from "../intcode";


(async () => {
    const input: string = await readInputFile(path.join(__dirname + '/data.txt'));
    const inputProgram = input.split(',').map(Number);

    permutations([0, 1, 2, 3, 4]).reduce((output: number, phase: []): number => {
        const amplifierOutput = [];

        _.range(0, 5).forEach(i => {
            let isFirstInput = true;
            intcodeComputer(

            )
        })
    })

    intcodeComputer(
        [...inputProgram],
        0,
        () => {
            const input = readline.question('>> INPUT: ');
            return Number(input);
        },
        (op: number) => console.log(op),
    );
})();
