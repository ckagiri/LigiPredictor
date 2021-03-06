import { IJob } from './jobs/job';

export class Queue {
  tokensInInterval: number;
  tokensLeftInInterval: number;
  timeInterval: number;
  jobs: IJob[];
  pendingJobs: any[];
  isActive: boolean;
  timer: any;

  constructor(limit: number, timeInterval: number) {
    this.tokensInInterval = limit;
    this.tokensLeftInInterval = limit;
    this.timeInterval = timeInterval;
    this.isActive = false;
    this.jobs = [];
    this.pendingJobs = [];
  }

  start = () => {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.startTimer();
    this.processJobQueue();
  }

  startTimer = () => {    
    this.timer = setInterval(() => {
      this.tokensLeftInInterval = this.tokensInInterval;
      while(this.pendingJobs.length > 0) {
        if(this.tokensLeftInInterval > 0) {
          let pendingJob = this.pendingJobs.pop();
          pendingJob();
        } else {
          break;
        }
      }
      if(this.pendingJobs.length == 0 && this.jobs.length == 0){
        this.cleanUp();
      }
    }, this.timeInterval);
  }

  addJob = (job: IJob) => {
    this.jobs.push(job);
    if (!this.isActive) {
      this.start();
    }
  }

  processJobQueue = () => {
    if(this.jobs.length > 0) {
      let job = this.jobs.pop();
      this.processLastJob(job);
    } else {
      this.cleanUp();
    }
  }

  processLastJob = (job: IJob) => {
    let wrappedJob = this.wrapJob(job);
    wrappedJob();
  }

  wrapJob = (job: IJob) => {
    let self = this;
    return async () => {
      if (self.tokensLeftInInterval > 0) {
        self.tokensLeftInInterval -= 1;
        try {
          await job.start(this);
          self.processJobQueue();
        } catch (error) {
          console.error(error)
          self.cleanUp();                    
        }
      } else {
        let wrappedJob = self.wrapJob(job);
        self.pendingJobs.push(wrappedJob);
      }
    }
  }

  cleanUp = () => {
    if(this.isActive) {
      console.log('** cleanup')
      clearInterval(this.timer);
      this.timer = null;
      this.isActive = false;
    }
  }
}