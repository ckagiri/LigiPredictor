import { Observable } from 'rxjs';

import { ITeam, TeamModel } from '../models/team.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ITeamConverter, TeamConverter } from '../converters/team.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ITeamRepository extends IBaseProviderRepository<ITeam> {
  findByNameAndUpdate$(name: any, obj?: any): Observable<ITeam>;
  findEachByNameAndUpdate$(teams: ITeam[]): Observable<ITeam[]>;
  findByName$(name: string): Observable<ITeam>;
}

export class TeamRepository extends BaseProviderRepository<ITeam> implements ITeamRepository {
  static getInstance(provider: ApiProvider): ITeamRepository {
    return new TeamRepository(TeamConverter.getInstance(provider));
  }

  constructor(converter: ITeamConverter) {
    super(TeamModel, converter);
  }

  findByNameAndUpdate$(name: any, obj?: any): Observable<ITeam> {
    let partialUpdate = true;
    if (obj == undefined){
      obj = name;
      name = obj.name;
      partialUpdate = false;
    }
    let query = {
      $or: [{ 'name': name }, { 'shortName': name }, { 'aliases': name }]
    }
    Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key])                  
    if(partialUpdate) {
      return this._baseRepo.findOneAndUpdate$(query, obj)      
    }
    return this._converter.from(obj)
      .flatMap((obj: any) => { 
        let { externalReference } = obj;
        delete obj.externalReference;      
        return this._findOneAndUpdate$(query, obj, externalReference)
    });
  }  

  findEachByNameAndUpdate$(teams: ITeam[]): Observable<ITeam[]> {
    let obs: any[] = [];
    
    for (let team of teams) {
      obs.push(this.findByNameAndUpdate$(team));
    }
    return Observable.forkJoin(obs);  
  }  

  findByName$(name: string): Observable<ITeam> {
    let query = {
      $or: [ 
        {'name': name},
        {'shortName': name},
        {'aliases': name}
      ]
    };
    return this.findOne$(query);
  }  
}