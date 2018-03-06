"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class LigiLeagueConverter {
    convert(data) {
        return rxjs_1.Observable.of({
            name: data.name,
            code: data.code,
            slug: data.slug
        });
    }
}
exports.LigiLeagueConverter = LigiLeagueConverter;
//# sourceMappingURL=league.converter.ligi.js.map