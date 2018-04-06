"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
class LeagueConverter {
    static getInstance() {
        return new LeagueConverter();
    }
    constructor() { this.provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA; }
    from(data) {
        return rxjs_1.Observable.of({
            name: data.name,
            code: data.code,
            slug: data.slug
        });
    }
}
exports.LeagueConverter = LeagueConverter;
//# sourceMappingURL=league.converter.js.map