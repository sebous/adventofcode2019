import { join } from "path";
import { readInputFile } from "../util";
import _ from "lodash";

enum Color {
    BLACK,
    WHITE,
    TRANSPARENT,
}

function calculateImage(width: number, height: number, input: string) {
    const pixels = input.split('').map(Number);
    if (!pixels) return;

    const layerArea = width * height;
    const layerCount = pixels.length / layerArea;

    const layersArray: number[][] = [];
    let counter = 1;
    let currentIndex = 0;
    while (counter <= layerCount) {
        const chunk = pixels.slice(currentIndex, currentIndex + layerArea);
        layersArray.push(chunk);
        counter += 1;
        currentIndex += layerArea;
    }

    const targetLayer = _.minBy(layersArray, layer => layer.filter(pixel => pixel === 0).length);
    if (targetLayer) {
        const num1Count = targetLayer.reduce((numCount, pixel) => pixel === 1 ? numCount + 1 : numCount, 0);
        const num2Count = targetLayer.reduce((numCount, pixel) => pixel === 2 ? numCount + 1 : numCount, 0);
        console.log(num1Count * num2Count);
    }

    // part2
    const composedLayer = layersArray[0].map((currentPixel: number, i) => {
        let composedPixel = currentPixel;
        _.range(1, layersArray.length + 1).forEach(layerIndex => {
            if (composedPixel === Color.BLACK || composedPixel === Color.WHITE) {
                // do nothing
            } else if (composedPixel === Color.TRANSPARENT) {
                composedPixel = layersArray[layerIndex][i];
            }
        });
        return composedPixel;
    });

    const printToConsole = (composedLayer: number[]) => {
        for (let y = 0; y < height; y++) {
            let str = '';
            for (let x = 0; x < width; x++) {
                str += `${composedLayer[x + y * width] === 0 ? ' ' : '#'}`;
            }
            console.log(str);
        }
    }

    printToConsole(composedLayer);
}


(async () => {
    const inputOne: string = await readInputFile(join(__dirname, '/data.txt'));
    calculateImage(25, 6, inputOne);
})()