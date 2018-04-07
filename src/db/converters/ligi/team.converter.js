"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
class TeamConverter {
    static getInstance() {
        return new TeamConverter();
    }
    constructor() { this.provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA; }
    from(data) {
        return rxjs_1.Observable.of({
            name: data.name,
            shortName: data.shortName,
            code: data.code,
            slug: data.slug,
            aliases: data.aliases
        });
    }
}
exports.TeamConverter = TeamConverter;
//# sourceMappingURL=team.converter.js.map