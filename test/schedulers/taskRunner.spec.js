"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;
const taskRunner_1 = require("../../src/app/schedulers/taskRunner");
describe('TaskRunner', () => {
    let taskRunner = new taskRunner_1.TaskRunner();
    describe('run', () => {
        it('should call begin', () => {
            let stub = sinon.stub();
            taskRunner.on('begin', stub);
            expect(stub.called).to.be.false;
            taskRunner.run({});
            expect(stub.calledOnce).to.be.true;
            expect(stub.callCount).to.equal(1);
        });
        it('should not call end before waiting delay', (done) => {
            let stub = sinon.stub();
            taskRunner.on('end', stub);
            taskRunner.run({
                whenToExecute: 25
            });
            setTimeout(() => {
                expect(stub.called).to.be.false;
                done();
            }, 5);
        });
        it('should call end after waiting delay', (done) => {
            let stub = sinon.stub();
            taskRunner.on('end', stub);
            taskRunner.run({
                whenToExecute: 5
            });
            setTimeout(() => {
                expect(stub.called).to.be.true;
                done();
            }, 20);
        });
        it('should not call end before executing task', (done) => {
            let stub = sinon.stub();
            taskRunner.on('end', stub);
            taskRunner.run({
                whenToExecute: 5,
                task: () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let res = 'result';
                            resolve(res);
                        }, 35);
                    });
                }
            });
            setTimeout(() => {
                expect(stub.called).to.be.false;
                done();
            }, 15);
        });
        it('should call end after executing task', (done) => {
            let stub = sinon.stub();
            taskRunner.on('end', stub);
            taskRunner.run({
                whenToExecute: 0,
                task: () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                        }, 5);
                    });
                }
            });
            setTimeout(() => {
                expect(stub.called).to.be.true;
                done();
            }, 25);
        });
        it('should call data after taskExecution', (done) => {
            let stub = sinon.stub();
            taskRunner.on('data', stub);
            taskRunner.run({
                whenToExecute: 5,
                task: () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let res = 'result';
                            resolve(res);
                        }, 5);
                    });
                }
            });
            setTimeout(() => {
                expect(stub.called).to.be.true;
                expect(stub.calledWith('result')).to.be.true;
                done();
            }, 25);
        });
    });
});
//# sourceMappingURL=taskRunner.spec.js.map