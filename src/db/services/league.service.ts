import { Observable } from 'rxjs';
import { LeagueRepository } from '../repositories/league.repo';
import { LeagueConverter } from '../converters/league.converter';
import { ILeagueModel } from '../models/league.model';

export class LeagueService {
  constructor(private leagueRepo: LeagueRepository, private leagueConverter: LeagueConverter) {
  }

  save$(data: any): Observable<ILeagueModel> {
    return this.leagueConverter.convert(data)
      .flatMap((obj) => {
        return this.leagueRepo.save$(obj);
    });
  }
}