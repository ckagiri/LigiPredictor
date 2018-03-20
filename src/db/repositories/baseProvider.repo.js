"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_repo_1 = require("../repositories/base.repo");
class BaseProviderRepository extends base_repo_1.BaseRepository {
    constructor(schemaModel, converter) {
        super(schemaModel);
        this._converter = converter;
    }
    save$(obj) {
        return this._converter.from(obj)
            .flatMap(entity => {
            return this.save$(entity);
        });
    }
}
exports.BaseProviderRepository = BaseProviderRepository;
//# sourceMappingURL=baseProvider.repo.js.map