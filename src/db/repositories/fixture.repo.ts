import { Observable } from 'rxjs';

import { IFixture, FixtureModel } from '../models/fixture.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { IFixtureConverter, FixtureConverter } from '../converters/fixture.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IFixtureRepository extends IBaseProviderRepository<IFixture> {
  findSelectableFixtures$(seasonId: string, gameRound: number): Observable<IFixture[]>;
  findBySeasonAndSlugAndUpdate$(obj: any): Observable<IFixture>;  
  findEachBySeasonAndSlugAndUpdate$(objs: any[]): Observable<IFixture[]>;
}

export class FixtureRepository extends BaseProviderRepository<IFixture> implements IFixtureRepository {
  static getInstance(provider: ApiProvider): IFixtureRepository {
    return new FixtureRepository(FixtureConverter.getInstance(provider));
  }

  constructor(converter: IFixtureConverter) {
    super(FixtureModel, converter);
  }

  findSelectableFixtures$(seasonId: string, gameRound: number) {
    return Observable.of([<IFixture>{}])    
  }  

  findBySeasonAndSlugAndUpdate$(obj: any) {
    return this._converter.from(obj)
      .flatMap((obj: any) => { 
        let { season, slug, externalReference } = obj;        
        let query = { season, slug }    
        delete obj.externalReference;      
        return this._findOneAndUpdate$(query, obj, externalReference)
    })
  }

  findEachBySeasonAndSlugAndUpdate$(objs: any[]) {
    let obs: any[] = [];
    
    for (let obj of objs) {
      obs.push(this.findBySeasonAndSlugAndUpdate$(obj));
    }
    return Observable.forkJoin(obs);  
  }
}