"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const user_model_1 = require("../../src/db/models/user.model");
describe.only('Users', () => {
    describe('schema', () => {
        describe('an empty user', () => {
            const u = new user_model_1.UserModel();
            it('should have 1 mandatory property', (done) => {
                u.validate((err) => {
                    chai_1.expect(Object.keys(err.errors)).to.have.lengthOf(1);
                    done();
                });
            });
            it('should require an email', (done) => {
                u.validate((err) => {
                    chai_1.expect(err.errors.email).to.exist;
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=user.model.spec.js.map