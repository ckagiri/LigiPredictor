"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class LigiLeagueConverter {
    constructor() {
        this.provider = 'LIGI';
    }
    from(data) {
        return rxjs_1.Observable.of({
            name: data.name,
            code: data.code,
            slug: data.slug
        });
    }
}
exports.LigiLeagueConverter = LigiLeagueConverter;
//# sourceMappingURL=league.converter.js.map