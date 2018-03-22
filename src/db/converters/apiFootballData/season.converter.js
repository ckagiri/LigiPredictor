"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
class SeasonConverter {
    constructor() { this.provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA; }
    from(data) {
        return rxjs_1.Observable.of({
            name: data.caption,
            year: data.year,
            currentMatchRound: data.currentMatchday,
            externalReference: {
                [this.provider.toString()]: {
                    id: data.id
                }
            }
        });
    }
}
exports.SeasonConverter = SeasonConverter;
//# sourceMappingURL=season.converter.js.map