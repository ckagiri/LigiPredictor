"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const eventMediator_1 = require("../../src/common/eventMediator");
describe.only('EventMediator', () => {
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
        console.log('1', mediator.eventNames());
        mediator.removeListener('event', handler);
        console.log('2', mediator.eventNames());
        let events = mediator.eventNames().filter(n => n == 'event');
        chai_1.assert.deepEqual(events, []);
    });
    it('clears handlers', () => {
        mediator.addListener('event', () => { });
        mediator.removeAllListeners();
        console.log('3', mediator.eventNames());
        chai_1.assert.deepEqual(mediator.eventNames(), []);
    });
});
//# sourceMappingURL=eventMediator.spec.js.map