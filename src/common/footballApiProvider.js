"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FootballApiProvider {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    toString() { return this.name; }
    equals(o) {
        return (o instanceof FootballApiProvider) && (this.value == o.value);
    }
}
FootballApiProvider.LIGI = new FootballApiProvider(0, 'LIGI');
FootballApiProvider.API_FOOTBALL_DATA = new FootballApiProvider(1, 'API_FOOTBALL_DATA');
exports.FootballApiProvider = FootballApiProvider;
//# sourceMappingURL=footballApiProvider.js.map