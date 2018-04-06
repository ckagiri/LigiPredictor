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
    findByExternalId$(id) {
        let extRefIdKey = `externalReference.${this.Provider}.id`;
        return this.findOne$({ [extRefIdKey]: id });
    }
    findByExternalIds$(ids) {
        let extRefIdKey = `externalReference.${this.Provider}.id`;
        return this.findAll$({ [extRefIdKey]: { $in: ids } });
    }
    insert$(obj) {
        return this._baseRepo.insert$(obj);
    }
    insertMany$(objs) {
        return this._baseRepo.insertMany$(objs);
    }
    findByIdAndUpdate$(id, update) {
        return this._baseRepo.findByIdAndUpdate$(id, update);
    }
    findOneAndUpdate$(conditions, update) {
        return this._baseRepo.findOneAndUpdate$(conditions, update);
    }
    findAll$(conditions) {
        return this._baseRepo.findAll$(conditions);
    }
    findById$(id) {
        return this._baseRepo.findById$(id);
    }
    findOne$(conditions) {
        return this._baseRepo.findOne$(conditions);
    }
}
exports.BaseProviderRepository = BaseProviderRepository;
//# sourceMappingURL=baseProvider.repo.js.map