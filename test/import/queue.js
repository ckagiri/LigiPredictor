// describe('Queue', () => {
//   it('should start with 0 jobs', () => {
//     let q = new Queue();
//     q.start();
//     q.jobs.length = 0;
//     q.pending.length = 0;
//     //
//   })
// })
// given I have queue with interval & limit
// when I add a job
// then it should push job
// it should schedule to run in interval
// the schedule runs any pending jobs
// it should call next job
// if jobs > 0
// next job should pop jobs 
// next job should wrap job and run wrapper
// clear interval no more jobs
// wrapper.run should run job passing queue 
// wrapper run should call next job
// if tokens finished push to pending
// clear interval after processing last one
//# sourceMappingURL=queue.js.map