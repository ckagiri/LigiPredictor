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
            .map(d => {
            const obj = Object.assign({}, d.toObject());
            return obj;
        });
    }
    findByIdAndUpdate$(id, update) {
        return rxjs_1.Observable.of({});
    }
    findOneAndUpdate$(conditions, update) {
        return rxjs_1.Observable.of({});
    }
    findAll$(conditions = {}) {
        return this._baseDao.findAll$(conditions)
            .flatMap(users => {
            return rxjs_1.Observable.from(users);
        })
            .map(user => {
            return Object.assign({}, user.toObject());
        })
            .toArray();
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repo.js.map