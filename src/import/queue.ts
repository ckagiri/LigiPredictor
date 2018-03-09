export class Queue {
  tokensInInterval: number;
  tokensLeftInInterval: number;
  timeInterval: number;
  jobs: any[];
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

  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.startTimer();
    this.processJobQueue();
  }

  startTimer() {    
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

  addJob(job: any) {
    this.jobs.push(job);
    if (!this.isActive) {
      this.start();
    }
  }

  processJobQueue() {
    if(this.jobs.length > 0) {
      let job = this.jobs.pop();
      this.processLastJob(job);
    }
  }

  processLastJob(job) {
    let wrappedJob = this.wrapJob(job);
    wrappedJob();
  }

  wrapJob(job) {
    return () => {
      if (this.tokensLeftInInterval > 0) {
        this.tokensLeftInInterval -= 1;
        job.start(this);
        this.processJobQueue();
      } else {
        let wrappedJob = this.wrapJob(job);
        this.pendingJobs.push(wrappedJob);
      }
    }
  }

  cleanUp() {
    clearInterval(this.timer);
    this.timer = null;
    this.isActive = false;
  }
}