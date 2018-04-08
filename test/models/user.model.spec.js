"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const bcrypt = require("bcrypt-nodejs");
const user_model_1 = require("../../src/db/models/user.model");
describe('Users', () => {
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
        describe('a minimal user', () => {
            const user = {
                username: 'Alpha',
                email: 'test@example.com',
                phone: '+254123456',
            };
            const u = new user_model_1.UserModel(user);
            it('should have 0 errors', (done) => {
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    done();
                });
            });
            it('should not be admin', (done) => {
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('isAdmin', false);
                    done();
                });
            });
            it('should have an id', (done) => {
                chai_1.expect(u).to.have.property('id');
                chai_1.expect(u.id).not.to.be.empty;
                chai_1.expect(u.id).to.be.a('string');
                done();
            });
            it('should not be admin', (done) => {
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('isAdmin', false);
                    done();
                });
            });
        });
        describe('an admin user', () => {
            const user = {
                username: 'Alpha',
                email: 'admin@example.com',
                isAdmin: true,
                phone: '+254123456'
            };
            const u = new user_model_1.UserModel(user);
            it('should be admin', (done) => {
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('isAdmin', true);
                    done();
                });
            });
        });
        describe('comparePassword', () => {
            const salt = bcrypt.genSaltSync(10);
            const user = {
                username: 'Alpha',
                local: {},
                email: 'user@example.com',
                phone: '+254123456'
            };
            it('should fail on comparePassword with empty pwd', (done) => {
                const u = new user_model_1.UserModel(user);
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('local');
                });
                u.comparePassword('test', (err, isMatch) => {
                    chai_1.expect(isMatch).to.be.undefined;
                    chai_1.expect(err).to.eql('Incorrect arguments');
                    done();
                });
            });
            it('should fail on incorrectly salted stored pwd', (done) => {
                user.local.password = 'test';
                const u = new user_model_1.UserModel(user);
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('local');
                });
                u.comparePassword('test', (err, isMatch) => {
                    chai_1.expect(isMatch).to.be.undefined;
                    chai_1.expect(err).to.eql('Not a valid BCrypt hash.');
                    done();
                });
            });
            it('should fail on comparePassword with wrong pwd', (done) => {
                user.local.password = bcrypt.hashSync('test', salt);
                const u = new user_model_1.UserModel(user);
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('local');
                    chai_1.expect(u.local).to.have.property('password');
                });
                u.comparePassword('test2', (err, isMatch) => {
                    chai_1.expect(isMatch).to.be.false;
                    chai_1.expect(err).to.be.null;
                    done();
                });
            });
            it('should succeed on comparePassword with correct pwd', (done) => {
                user.local.password = bcrypt.hashSync('test', salt);
                const u = new user_model_1.UserModel(user);
                u.validate((err) => {
                    chai_1.expect(err).to.eql(null);
                    chai_1.expect(u).to.have.property('local');
                    chai_1.expect(u.local).to.have.property('password');
                });
                u.comparePassword('test', (err, isMatch) => {
                    chai_1.expect(isMatch).to.be.true;
                    chai_1.expect(err).to.be.null;
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=user.model.spec.js.map