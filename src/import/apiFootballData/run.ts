import { Queue } from '../queue'
import { MainJob } from './main.job';

let q = new Queue(50, 1000*60);

q.addJob(MainJob.getInstance());