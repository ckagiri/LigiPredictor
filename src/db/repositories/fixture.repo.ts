import { Observable } from 'rxjs';

import { IFixture, FixtureModel, FixtureStatus } from '../models/fixture.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { IFixtureConverter, FixtureConverter } from '../converters/fixture.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IFixtureRepository extends IBaseProviderRepository<IFixture> {
  findSelectableFixtures$(seasonId: string, gameRound: number): Observable<IFixture[]>;
  findBySeasonAndTeamsAndUpsert$(obj: any): Observable<IFixture>;  
  findEachBySeasonAndTeamsAndUpsert$(objs: any[]): Observable<IFixture[]>;
  findAllFinishedWithPendingPredictions$(seasonId: string, gameRound?: number): Observable<IFixture[]>;
}

export class FixtureRepository extends BaseProviderRepository<IFixture> implements IFixtureRepository {
  static getInstance(provider: ApiProvider): IFixtureRepository {
    return new FixtureRepository(FixtureConverter.getInstance(provider));
  }

  constructor(converter: IFixtureConverter) {
    super(FixtureModel, converter);
  }

  findSelectableFixtures$(seasonId: string, gameRound: number) {
    const { SCHEDULED, TIMED, IN_PLAY, CANCELED, POSTPONED, FINISHED } = FixtureStatus;
    let query = { 
      $or: [
        { $and: [
          { season: seasonId }, { gameRound }, 
          { status: { $in: [SCHEDULED, TIMED, IN_PLAY] } }
        ] },
        { $and: [
          { season: seasonId}, { gameRound }, 
          { status: { $in: [CANCELED, POSTPONED, FINISHED] } },
          { allPredictionsProcessed: false }
        ] }
      ] }
  
    return this.findAll$(query, null, {sort: 'date'})  }  

  findBySeasonAndTeamsAndUpsert$(obj: any) {
    return this._converter.from(obj)
      .flatMap((obj: any) => { 
        let { season, homeTeam, awayTeam, externalReference } = obj;        
        let query = { season, 'homeTeam.id': homeTeam.id, 'awayTeam.id': awayTeam.id }    
        delete obj.externalReference;      
        Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key])                          
        return this._findOneAndUpsert$(query, obj, externalReference)
    })
  }

  findEachBySeasonAndTeamsAndUpsert$(objs: any[]) {
    let obs: any[] = [];
    
    for (let obj of objs) {
      obs.push(this.findBySeasonAndTeamsAndUpsert$(obj));
    }
    return Observable.forkJoin(obs);  
  }

  findAllFinishedWithPendingPredictions$(seasonId: string, gameRound?: number) {
		let query: any = {
			$and: [
					{ season: seasonId },
					{ allPredictionsProcessed: false }, 
					{ status: { $in: ['CANCELED', 'POSTPONED', 'FINISHED'] } }
				]
			}
		if(gameRound) {
			query.$and.push({ gameRound });
		}
		return this.findAll$(query)
	}
}