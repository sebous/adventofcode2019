import path from "path";
import { intcodeComputer, intcodeOptimizedComputer } from "../intcode";
import { readInputFile } from "../util";
import { questionInt } from "readline-sync";
import _ from "lodash";

(async () => {
    const input: string = await readInputFile(path.join(__dirname, '/data.txt'));
    const inputData = input.split(',').map(Number);
    intcodeOptimizedComputer(
        [...inputData],
        0,
        () => {
            const input = questionInt('>> INPUT:');
            return input;
        },
        op => console.log(op),
    );
})()