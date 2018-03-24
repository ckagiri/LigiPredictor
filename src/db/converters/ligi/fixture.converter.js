"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const footballApiProvider_1 = require("../../../common/footballApiProvider");
class FixtureConverter {
    static getInstance() {
        return new FixtureConverter();
    }
    constructor() { this.provider = footballApiProvider_1.FootballApiProvider.API_FOOTBALL_DATA; }
    from(data) {
        return rxjs_1.Observable.of({
            slug: data.slug
        });
    }
}
exports.FixtureConverter = FixtureConverter;
//# sourceMappingURL=fixture.converter.js.map