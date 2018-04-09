import { Observable } from 'rxjs';

import { ITeam, TeamModel } from '../models/team.model';
import { IBaseProviderRepository, BaseProviderRepository } from './baseProvider.repo';
import { ITeamConverter, TeamConverter } from '../converters/team.converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface ITeamRepository extends IBaseProviderRepository<ITeam> {
  findByNameAndUpdate$(name: any, obj?: any): Observable<ITeam>;
  findEachByNameAndUpdate$(objs: any[]): Observable<ITeam[]>;
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
    if(partialUpdate) {
      return this._baseRepo.findOneAndUpdate$(query, obj)      
    }
    return this._converter.from(obj)
      .flatMap((obj: any) => { 
        let { externalReference } = obj;
        delete obj.externalReference;      
        return this._findOneAndUpsert$(query, obj, externalReference)
    });
  }  

  findEachByNameAndUpdate$(objs: any[]): Observable<ITeam[]> {
    let obs: any[] = [];
    
    for (let obj of objs) {
      obs.push(this.findByNameAndUpdate$(obj));
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