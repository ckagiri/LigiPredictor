"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const promisify = require("util-promisify");
const setTimeoutPromise = promisify(setTimeout);
class SimpleScheduler extends events_1.EventEmitter {
    start({ whenToExecute, task = () => { }, context, callback }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (task && typeof task !== 'function') {
                throw new Error('Task must be a function');
            }
            if (callback && typeof callback !== 'function') {
                throw new Error('Callback must be a function');
            }
            this.emit('begin');
            try {
                yield setTimeoutPromise(whenToExecute || 0);
                console.time('execute');
                const data = yield Promise.resolve().then(() => task.call(context));
                if (callback)
                    callback(data);
                console.timeEnd('execute');
                this.emit('end');
                this.emit('data', data);
            }
            catch (err) {
                this.emit('error', err);
                if (callback)
                    callback(err);
            }
        });
    }
}
exports.SimpleScheduler = SimpleScheduler;
//# sourceMappingURL=simple.scheduler.js.map