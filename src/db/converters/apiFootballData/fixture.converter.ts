import { Observable } from 'rxjs';

import { IFixture } from '../../models/fixture.model';
import { IFixtureConverter } from '../fixture.converter';
import { FootballApiProvider as ApiProvider } from '../../../common/footballApiProvider';
import { ISeasonRepository, SeasonRepository } from '../../repositories/season.repo';
import { ITeamRepository, TeamRepository } from '../../repositories/team.repo';

export class FixtureConverter implements IFixtureConverter {
  provider: ApiProvider;

  static getInstance(): IFixtureConverter {
    return new FixtureConverter(
      SeasonRepository.getInstance(ApiProvider.API_FOOTBALL_DATA), 
      TeamRepository.getInstance(ApiProvider.API_FOOTBALL_DATA)
    );
  }

  constructor(
    private seasonRepo: ISeasonRepository,
    private teamRepo: ITeamRepository
  ) { this. provider = ApiProvider.API_FOOTBALL_DATA }

  from(data: any): any {
    return Observable.zip(
			this.seasonRepo.findByExternalId$(data.competitionId),
			this.teamRepo.findByName$(data.homeTeamName),
			this.teamRepo.findByName$(data.awayTeamName),
			(season: any, homeTeam: any, awayTeam: any) => {        
				return {
          season: season._id,
          date: new Date(data.date),    
          matchRound: data.matchday,          
          status: data.status,
					homeTeam: {
            slug: homeTeam.slug,
						name: homeTeam.name,
						id: homeTeam._id,
						crestUrl: homeTeam.crestUrl
					},
					awayTeam: {
            slug: awayTeam.slug,
						name: awayTeam.name,
						id: awayTeam._id,
						crestUrl: awayTeam.crestUrl
					},
          slug: `${homeTeam.slug}-${awayTeam.slug}`,
					result: {
						goalsHomeTeam: data.result.goalsHomeTeam,
						goalsAwayTeam: data.result.goalsAwayTeam
					},
          odds: data.odds,
          externalReference: {
            [this.provider]: {
              id: data.id
            }
          }
				}
      })
  }
  
  map(data: any[]): any[] {
    return data;
  }
}