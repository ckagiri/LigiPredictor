import { Observable } from 'rxjs';

import { ISeason } from '../../models/season.model';
import { ISeasonConverter } from '../season.converter';
import { ILeagueRepository, LeagueRepository } from '../../repositories/league.repo';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';

export class SeasonConverter implements ISeasonConverter {
  provider: ApiProvider;

  static getInstance(): ISeasonConverter {
    return new SeasonConverter(LeagueRepository.getInstance(ApiProvider.API_FOOTBALL_DATA))
  }

  constructor(private leagueRepo: ILeagueRepository) { this. provider = ApiProvider.API_FOOTBALL_DATA }
  
  from(data: any): Observable<ISeason> {
    return this.leagueRepo.findById$(data.leagueId) 
      .flatMap((league) => {
        return Observable.of({   
          league: {
            id: league['_id'],
            name: league.name,
            slug: league.slug
          },
          name: data.name,
          slug: data.slug,
          year: data.year,
          seasonStart: data.seasonStart,
          seasonEnd: data.seasonEnd,
          currentGameRound: data.currentGameRound,
          currentMatchRound: data.currentMatchRound
        })
      })
  }
}