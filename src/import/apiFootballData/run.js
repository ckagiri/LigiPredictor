"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("../queue");
const main_job_1 = require("./main.job");
let q = new queue_1.Queue(50, 1000 * 60);
q.addJob(main_job_1.MainJob.getInstance());
//# sourceMappingURL=run.js.map