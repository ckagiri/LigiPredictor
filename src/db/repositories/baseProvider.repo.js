"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const _ = require("lodash");
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
    findByExternalIdAndUpdate$(id, obj) {
        let externalIdKey = `externalReference.${this.Provider}.id`;
        if (obj == undefined) {
            obj = id;
            id = obj.id;
            return this._converter.from(obj)
                .flatMap((obj) => {
                let { externalReference } = obj;
                delete obj.externalReference;
                return this._baseRepo.findOneAndUpdate$({ [externalIdKey]: id }, obj);
            });
        }
        else {
            return this._baseRepo.findOneAndUpdate$({ [externalIdKey]: id }, obj);
        }
    }
    findEachByExternalIdAndUpdate$(objs) {
        let obs = [];
        for (let obj of objs) {
            obs.push(this.findByExternalIdAndUpdate$(obj));
        }
        return rxjs_1.Observable.forkJoin(obs);
    }
    findByExternalId$(id) {
        let externalIdKey = `externalReference.${this.Provider}.id`;
        return this.findOne$({ [externalIdKey]: id });
    }
    findByExternalIds$(ids) {
        let externalIdKey = `externalReference.${this.Provider}.id`;
        return this.findAll$({ [externalIdKey]: { $in: ids } });
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
    findAll$(conditions, projection, options) {
        return this._baseRepo.findAll$(conditions, projection, options);
    }
    findById$(id) {
        return this._baseRepo.findById$(id);
    }
    findOne$(conditions) {
        return this._baseRepo.findOne$(conditions);
    }
    _findOneAndUpdate$(conditions, obj, externalReference) {
        return this._baseRepo.findOneAndUpdate$(conditions, obj, { new: true, upsert: true })
            .flatMap((updatedObj) => {
            if (externalReference == undefined) {
                return rxjs_1.Observable.of(updatedObj);
            }
            let externalId = externalReference[this.Provider]['id'];
            _.merge(updatedObj, { externalReference });
            return this._baseRepo.save$(updatedObj);
        });
    }
}
exports.BaseProviderRepository = BaseProviderRepository;
//# sourceMappingURL=baseProvider.repo.js.map