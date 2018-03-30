"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const base_repo_1 = require("./base.repo");
class UserRepository extends base_repo_1.BaseRepository {
    static getInstance() {
        return new UserRepository();
    }
    constructor() {
        super(user_model_1.UserModel);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repo.js.map