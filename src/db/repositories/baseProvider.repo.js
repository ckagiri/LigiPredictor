"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const base_repo_1 = require("../repositories/base.repo");
class BaseProviderRepository {
    constructor(schemaModel, converter) {
        this._baseRepo = new base_repo_1.BaseRepository(schemaModel);
        this._converter = converter;
    }
    get Provider() {
        return this._converter.provider;
    }
    save$(obj) {
        return this._converter.from(obj)
            .flatMap(entity => {
            return this._baseRepo.save$(entity);
        });
    }
    findByExternalIdAndUpdate$(obj) {
        return rxjs_1.Observable.of({});
    }
    findEachByExternalIdAndUpdate$(obj) {
        return rxjs_1.Observable.of([{}]);
    }
    getByExternalId$(id) {
        return rxjs_1.Observable.of({});
    }
    getByExternalIds$() {
        return rxjs_1.Observable.of([{}]);
    }
    findByIdAndUpdate$(id, update) {
        return this._baseRepo.findByIdAndUpdate$(id, update);
    }
    findOneAndUpdate$(conditions, update) {
        return this._baseRepo.findOneAndUpdate$(conditions, update);
    }
    findAll$() {
        return this._baseRepo.findAll$();
    }
}
exports.BaseProviderRepository = BaseProviderRepository;
//# sourceMappingURL=baseProvider.repo.js.map