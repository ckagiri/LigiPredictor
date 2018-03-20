import { Observable } from 'rxjs';
import { ILeagueRepository, LeagueRepository } from '../repositories/league.repo';
import { ILeagueModel } from '../models/league.model';

export interface ILeagueService {
  save$(data: any): Observable<ILeagueModel> 
}

export class LeagueService implements ILeagueService {
  static getInstance(): ILeagueService {
    return new LeagueService(LeagueRepository.getInstance());
  }  

  constructor(private leagueRepo: ILeagueRepository) {
  }

  save$(data: any): Observable<ILeagueModel> {
    return this.leagueRepo.save$(data);
  }
}