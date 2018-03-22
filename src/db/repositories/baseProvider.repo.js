"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_repo_1 = require("../repositories/base.repo");
class BaseProviderRepository {
    constructor(schemaModel, converter, baseRepo) {
        this._baseRepo = baseRepo || new base_repo_1.BaseRepository(schemaModel);
        this._converter = converter;
    }
    save$(obj) {
        return this._converter.from(obj)
            .flatMap(entity => {
            return this._baseRepo.save$(entity)
                .map(d => {
                const obj = Object.assign({}, d.toObject());
                return obj;
            });
        });
    }
}
exports.BaseProviderRepository = BaseProviderRepository;
//# sourceMappingURL=baseProvider.repo.js.map