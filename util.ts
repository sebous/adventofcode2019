import { readFile } from "fs";

export const readInputFile = (fileName: string): any => new Promise((res, rej) => {
    readFile(fileName, { encoding: 'utf-8' }, (err, data) => {
        if (err) rej(err);
        else res(data);
    });
});

export const permutations = (inputArray: number[]) => {
    const results = [];

    for (let i = 0; i < inputArray.length; i++) {
        const rest: number[][] = permutations(inputArray.slice(0, i).concat(inputArray.slice(i + 1)));

        if (!rest.length) {
            results.push([inputArray[i]]);
        } else {
            for (let j = 0; j < rest.length; j++) {
                results.push([inputArray[i]].concat(rest[j]));
            }
        }
    }
    return results;
}