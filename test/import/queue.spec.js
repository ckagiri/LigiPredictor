"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("../../src/import/queue");
const chai_1 = require("chai");
const sinon = require("sinon");
describe('Queue', () => {
    let q;
    let newJob = () => ({ start: () => { } });
    let job = beforeEach(() => {
        q = new queue_1.Queue(10, 100);
    });
    describe('construction', () => {
        it('should set token limits', () => {
            chai_1.assert.equal(q.tokensInInterval, 10);
            chai_1.assert.equal(q.tokensLeftInInterval, 10);
        });
        it('should set timer interval', () => {
            chai_1.assert.equal(q.timeInterval, 100);
        });
    });
    describe('add a job', () => {
        it('should start queue processing if not started', () => {
            let spy = sinon.spy(q, 'start');
            q.addJob(newJob());
            chai_1.expect(spy.called).to.be.true;
        });
        it('should not start queue processing if started', () => {
            q.addJob(newJob());
            let spy = sinon.spy(q, 'start');
            q.addJob(newJob());
            chai_1.expect(spy.called).not.to.be.true;
        });
    });
    describe('start a timer', () => {
        it('should restore tokensLeft to original after interval', () => {
            let clock = sinon.useFakeTimers();
            q.tokensLeftInInterval = 1;
            q.addJob(newJob());
            clock.tick(101);
            chai_1.assert.equal(q.tokensLeftInInterval, 10);
            clock.restore();
        });
        it('should start pending job after interval', () => {
            let clock = sinon.useFakeTimers();
            q = new queue_1.Queue(1, 100);
            q.jobs.push(newJob());
            let j = newJob();
            let spy = sinon.spy(j, 'start');
            q.addJob(j);
            clock.tick(101);
            sinon.assert.called(spy);
            clock.restore();
        });
        it('should reduce tokens left when processing pending job after interval', () => {
            let clock = sinon.useFakeTimers();
            q = new queue_1.Queue(1, 100);
            q.jobs.push(newJob());
            let j = newJob();
            let spy = sinon.spy(j, 'start');
            q.addJob(j);
            clock.tick(101);
            chai_1.assert.equal(q.tokensLeftInInterval, 0);
            clock.restore();
        });
        it('should schedule timer when tokens are finished during processing', () => {
            let clock = sinon.useFakeTimers();
            q = new queue_1.Queue(1, 100);
            q.jobs.push(newJob());
            q.jobs.push(newJob());
            q.addJob(newJob());
            clock.tick(101);
            chai_1.assert.equal(q.pendingJobs.length, 1);
            chai_1.expect(q.timer).to.exist;
            clock.restore();
        });
        it('should clear timer when no jobs remaining', () => {
            let clock = sinon.useFakeTimers();
            q = new queue_1.Queue(1, 100);
            q.jobs.push(newJob());
            q.jobs.push(newJob());
            q.addJob(newJob());
            chai_1.assert.equal(q.jobs.length, 1);
            chai_1.assert.equal(q.pendingJobs.length, 1);
            clock.tick(101);
            chai_1.assert.equal(q.jobs.length, 0);
            chai_1.assert.equal(q.pendingJobs.length, 1);
            clock.tick(101);
            chai_1.assert.equal(q.jobs.length, 0);
            chai_1.assert.equal(q.pendingJobs.length, 0);
            chai_1.expect(q.timer).to.not.exist;
            clock.restore();
        });
    });
    describe('start queue processing', () => {
        it('should process job queue', () => {
            let spy = sinon.spy(q, 'processJobQueue');
            q.addJob(newJob());
            chai_1.expect(spy.called).to.be.true;
        });
        it('should process the last job in queue', () => {
            let spy = sinon.spy(q, 'processLastJob');
            q.addJob(newJob());
            sinon.assert.calledOnce(spy);
            chai_1.assert.equal(q.jobs.length, 0);
        });
        it('should queue up jobs after starting queue processing', () => {
            q.addJob(newJob());
            q.addJob(newJob());
            q.addJob(newJob());
            chai_1.assert.equal(q.jobs.length, 2);
        });
    });
    describe('process last job', () => {
        it('should start the job', () => {
            let j = newJob();
            let spy = sinon.spy(j, 'start');
            q.addJob(j);
            sinon.assert.called(spy);
        });
        it('should reduce tokens left', () => {
            let j = newJob();
            q.addJob(j);
            chai_1.assert.equal(q.tokensLeftInInterval, 9);
        });
        it('should not reduce tokens left beyond 0', () => {
            q = new queue_1.Queue(1, 100);
            q.jobs.push(newJob());
            q.addJob(newJob());
            chai_1.assert.equal(q.tokensLeftInInterval, 0);
        });
        it('should push job to a pending queue when no more tokens left', () => {
            q.tokensLeftInInterval = 1;
            q.jobs.push(newJob());
            q.addJob(newJob());
            chai_1.assert.equal(q.jobs.length, 0);
            chai_1.assert.equal(q.pendingJobs.length, 1);
        });
        it('should process the last job after starting current job', () => {
            q.jobs.push(newJob());
            let j = newJob();
            let spy = sinon.spy(q, 'processLastJob');
            q.addJob(j);
            sinon.assert.calledTwice(spy);
        });
    });
    describe('start a job', () => {
        it('should be passed this queue instance', () => {
            let j = newJob();
            let spy = sinon.spy(j, 'start');
            q.addJob(j);
            sinon.assert.calledWith(spy, q);
        });
    });
});
//# sourceMappingURL=queue.spec.js.map