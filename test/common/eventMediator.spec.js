"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const eventMediator_1 = require("../../src/common/eventMediator");
describe('EventMediator', () => {
    let mediator;
    beforeEach(() => {
        mediator = new eventMediator_1.EventMediator();
    });
    it('triggers callbacks and removes', (done) => {
        let handler = (data) => {
            chai_1.assert.equal(data.key, 'value');
            done();
        };
        mediator.addListener('event', handler);
        mediator.publish('event', { key: 'value' });
        mediator.removeListener('event', handler);
        let events = mediator.eventNames().filter(n => n == 'event');
        chai_1.assert.deepEqual(events, []);
    });
    it('clears handlers', () => {
        mediator.addListener('event', () => { });
        mediator.removeAllListeners();
        chai_1.assert.deepEqual(mediator.eventNames(), []);
    });
});
//# sourceMappingURL=eventMediator.spec.js.map