import { Queue } from '../queue'
import { MainJob } from './main.job';

export const apiFootballDataImporter = {
  start: () => {
    console.log('** starting ApiFootballData Importer')
    let q = new Queue(50, 1000*60);    
    q.addJob(MainJob.getInstance());
  }
}