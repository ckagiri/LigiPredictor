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
class Queue {
    constructor(limit, timeInterval) {
        this.start = () => {
            if (this.isActive) {
                return;
            }
            this.isActive = true;
            this.startTimer();
            this.processJobQueue();
        };
        this.startTimer = () => {
            this.timer = setInterval(() => {
                this.tokensLeftInInterval = this.tokensInInterval;
                while (this.pendingJobs.length > 0) {
                    if (this.tokensLeftInInterval > 0) {
                        let pendingJob = this.pendingJobs.pop();
                        pendingJob();
                    }
                    else {
                        break;
                    }
                }
                if (this.pendingJobs.length == 0 && this.jobs.length == 0) {
                    this.cleanUp();
                }
            }, this.timeInterval);
        };
        this.addJob = (job) => {
            this.jobs.push(job);
            if (!this.isActive) {
                this.start();
            }
        };
        this.processJobQueue = () => {
            if (this.jobs.length > 0) {
                let job = this.jobs.pop();
                this.processLastJob(job);
            }
            else {
                this.cleanUp();
            }
        };
        this.processLastJob = (job) => {
            let wrappedJob = this.wrapJob(job);
            wrappedJob();
        };
        this.wrapJob = (job) => {
            let self = this;
            return () => __awaiter(this, void 0, void 0, function* () {
                if (self.tokensLeftInInterval > 0) {
                    self.tokensLeftInInterval -= 1;
                    try {
                        yield job.start(this);
                        self.processJobQueue();
                    }
                    catch (error) {
                        console.error(error);
                        self.cleanUp();
                    }
                }
                else {
                    let wrappedJob = self.wrapJob(job);
                    self.pendingJobs.push(wrappedJob);
                }
            });
        };
        this.cleanUp = () => {
            clearInterval(this.timer);
            this.timer = null;
            this.isActive = false;
        };
        this.tokensInInterval = limit;
        this.tokensLeftInInterval = limit;
        this.timeInterval = timeInterval;
        this.isActive = false;
        this.jobs = [];
        this.pendingJobs = [];
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map