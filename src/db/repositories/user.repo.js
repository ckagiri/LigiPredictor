"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const user_model_1 = require("../models/user.model");
const base_repo_1 = require("./base.repo");
class UserRepository {
    static getInstance() {
        return new UserRepository();
    }
    constructor() {
        this._baseRepo = new base_repo_1.BaseRepository(user_model_1.UserModel);
    }
    findAll$(conditions = {}) {
        return this._baseRepo.findAll$(conditions)
            .flatMap(users => {
            return rxjs_1.Observable.from(users);
        })
            .map(user => {
            return Object.assign({}, user.toObject());
        })
            .toArray();
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repo.js.map