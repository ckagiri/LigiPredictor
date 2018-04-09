"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const user_model_1 = require("../../src/db/models/user.model");
const user_repo_1 = require("../../src/db/repositories/user.repo");
const db = require("../../src/db/index");
const index_1 = require("../../src/config/environment/index");
let userRepo = user_repo_1.UserRepository.getInstance();
describe('User Repo', function () {
    this.timeout(5000);
    before(done => {
        db.init(index_1.config.testDb.uri, done, { drop: true });
    });
    beforeEach(done => {
        const user1 = new user_model_1.UserModel({
            username: 'chalo',
            email: 'chalo@example.com',
            local: { password: 'chalo' }
        });
        const user2 = {
            username: 'kagiri',
            email: 'kagiri@example.com'
        };
        Promise.all([user1.save(), user_model_1.UserModel.create(user2)]).then(() => done());
    });
    afterEach(done => {
        db.drop().then(() => { done(); });
    });
    after(done => {
        db.close().then(() => { done(); });
    });
    it('should find all users', (done) => {
        userRepo.findAll$()
            .subscribe(users => {
            console.log(users);
            chai_1.expect(users).to.have.length(2);
            done();
        });
    });
});
//# sourceMappingURL=user.repo..spec.js.map