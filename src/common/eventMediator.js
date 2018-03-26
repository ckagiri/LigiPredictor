"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class EventMediator {
    constructor() {
        this.emitter = new events_1.EventEmitter();
    }
    eventNames() {
        return this.emitter.eventNames();
    }
    publish(event, ...args) {
        return this.emitter.emit(event, ...args);
    }
    addListener(event, listener) {
        this.emitter.addListener(event, listener);
        return this;
    }
    removeListener(event, listener) {
        this.emitter.removeListener(event, listener);
        return this;
    }
    removeAllListeners(event) {
        if (event) {
            this.emitter.removeAllListeners(event);
        }
        else {
            this.emitter.removeAllListeners();
        }
        return this;
    }
}
exports.EventMediator = EventMediator;
//# sourceMappingURL=eventMediator.js.map