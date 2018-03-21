"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiProvider {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    toString() { return this.name; }
    equals(o) {
        return (o instanceof ApiProvider) && (this.value == o.value);
    }
}
ApiProvider.LIGI = new ApiProvider(0, 'LIGI');
ApiProvider.API_FOOTBALL_DATA = new ApiProvider(1, 'API_FOOTBALL_DATA');
exports.ApiProvider = ApiProvider;
//# sourceMappingURL=apiProvider.js.map