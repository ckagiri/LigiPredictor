"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const base_dao_1 = require("../repositories/base.dao");
class BaseRepository {
    constructor(schemaModel) {
        this._baseDao = new base_dao_1.BaseDao(schemaModel);
    }
    save$(data) {
        return this._baseDao.save$(data)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    insert$(data) {
        return this._baseDao.insert$(data)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    insertMany$(data) {
        return this._baseDao.insertMany$(data)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    findByIdAndUpdate$(id, update) {
        return this._baseDao.findByIdAndUpdate$(id, update)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    findOneAndUpdate$(conditions, update, options) {
        return this._baseDao.findOneAndUpdate$(conditions, update, options)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    findAll$(conditions = {}, projection, options) {
        return this._baseDao.findAll$(conditions, projection, options)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    findById$(id) {
        return this._baseDao.findById$(id)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
    findOne$(conditions) {
        return this._baseDao.findOne$(conditions)
            .catch((error) => {
            return rxjs_1.Observable.throw(error);
        })
            .map((data) => {
            return data;
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repo.js.map