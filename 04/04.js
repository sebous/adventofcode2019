const bottomLimit = 265275;
const topLimit = 781584;

function part1() {
    const passwordRange = [...Array(topLimit + 1).keys()]
        .filter(n => n >= bottomLimit)
        .filter(n => {
            const numStr = n.toString();
            let sameAdjascentExists = false;
            for (let i = 0; i < numStr.length - 1; i++) {
                if (numStr[i] === numStr[i + 1]) sameAdjascentExists = true;
            }
            return sameAdjascentExists;
        })
        .filter(n => {
            const numStr = n.toString();
            let areNumbersIncreasing = true;
            for (let i = 0; i < numStr.length - 1; i++) {
                if (numStr[i + 1] < numStr[i]) areNumbersIncreasing = false;
            }
            return areNumbersIncreasing;
        });
    console.log(passwordRange.length);
}

function part2() {
    const passwordRange = [...Array(topLimit + 1).keys()]
        .filter(n => n >= bottomLimit)
        .filter(n => {
            const numStr = n.toString();
            let sameAdjascentExists = false;
            const falsePositiveIndexes = [];
            for (let i = 0; i < numStr.length - 1; i++) {
                // match two after, two before or one before and one after
                if (
                    numStr[i] === numStr[i + 1] &&
                    numStr[i] === numStr[i + 2] ||
                    numStr[i] === numStr[i - 1] &&
                    numStr[i] === numStr[i - 2] ||
                    numStr[i] === numStr[i + 1] &&
                    numStr[i] === numStr[i - 1]
                ) {
                    falsePositiveIndexes.push(i);
                }
            }
            for (let i = 0; i < numStr.length - 1; i++) {
                if (
                    numStr[i] === numStr[i + 1] &&
                    !falsePositiveIndexes.includes(i) &&
                    !falsePositiveIndexes.includes(i + 1)
                ) {
                    sameAdjascentExists = true;
                }
            }
            return sameAdjascentExists;
        })
        .filter(n => {
            const numStr = n.toString();
            let areNumbersIncreasing = true;
            for (let i = 0; i < numStr.length - 1; i++) {
                if (numStr[i + 1] < numStr[i]) areNumbersIncreasing = false;
            }
            return areNumbersIncreasing;
        });
    console.log(passwordRange.length);
}

part1();
part2();
