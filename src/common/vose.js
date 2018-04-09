"use strict";
/**
 * Vose alias method for efficient sampling of weighted distribution
 * Borrowed almost entirely from https://github.com/jdiscar/vose-alias-method.js
 * Fantastic explanation here: http://www.keithschwarz.com/darts-dice-coins/
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Vose {
    constructor(weights) {
        this.init = (weights) => {
            let large = [];
            let small = [];
            let average, less, more;
            if (!(weights instanceof Array) || weights.length < 1) {
                throw new Error('Vose: weights must be a non-empty array');
            }
            this.totalDistinctValues = weights.length;
            this.probability = [];
            this.alias = [];
            average = 1.0 / this.totalDistinctValues;
            weights = normalizeScale(weights.slice(0));
            for (var i = 0; i < this.totalDistinctValues; i++) {
                ((weights[i] >= average) ? large : small).push(i);
            }
            while (small.length > 0 && large.length > 0) {
                less = small.shift();
                more = large.shift();
                this.probability[less] = weights[less] * this.totalDistinctValues;
                this.alias[less] = more;
                weights[more] = (weights[more] + weights[less]) - average;
                ((weights[more] >= average) ? large : small).push(more);
            }
            while (large.length !== 0) {
                this.probability[large.shift()] = 1;
            }
            while (small.length !== 0) {
                this.probability[small.shift()] = 1;
            }
        };
        this.next = () => {
            let column = getRandomInt(0, this.totalDistinctValues - 1);
            let coinToss = Math.random() < this.probability[column];
            return coinToss ? column : this.alias[column];
        };
        this.init(weights);
    }
}
exports.Vose = Vose;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function normalizeScale(weights) {
    var total = weights.reduce((a, b) => {
        return a + b;
    });
    if (total > 1) {
        weights = weights.map((value) => {
            return value / total;
        });
    }
    else if (total < 1) {
        weights.push(1 - total);
    }
    return weights;
}
exports.default = Vose;
//# sourceMappingURL=vose.js.map