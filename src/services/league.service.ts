import { Observable } from 'rxjs';
import { ILeagueRepository, LeagueRepository } from '../db/repositories/league.repo';
import { ILeagueModel } from '../db/models/league.model';
import { ApiProvider } from '../common/apiProvider';

export interface ILeagueService {
  save$(data: any): Observable<ILeagueModel> 
}

export class LeagueService implements ILeagueService {
  static getInstance(provider: ApiProvider): ILeagueService {
    return new LeagueService(LeagueRepository.getInstance(provider));
  }  

  constructor(private leagueRepo: ILeagueRepository) {
  }

  save$(data: any): Observable<ILeagueModel> {
    return this.leagueRepo.save$(data);
  }
}