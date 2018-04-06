import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document } from 'mongoose';

import { BaseRepository, IBaseRepository } from '../repositories/base.repo';
import { IEntity } from '../models/base.model';
import { IConverter } from '../converters/converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IBaseProviderRepository<T extends IEntity> extends IBaseRepository<T> {
  Provider: ApiProvider;
  save$(obj: IEntity): Observable<T>;  
  findByExternalIdAndUpdate$(obj: IEntity): Observable<T>;
  findEachByExternalIdAndUpdate$(obj: IEntity[]): Observable<T[]>;
  findByExternalId$(id: string|number): Observable<T>;  
  findByExternalIds$(ids: Array<string|number>): Observable<T[]>;
}

export class BaseProviderRepository<T extends IEntity> implements IBaseProviderRepository<T> {
  protected _baseRepo: IBaseRepository<T>;  
  protected _converter: IConverter;

  constructor(schemaModel: Model<Document>, converter: IConverter) {
    this._baseRepo = new BaseRepository<T>(schemaModel);
    this._converter = converter;
  }

  get Provider() {
    return this._converter.provider;
  }

  save$(obj: IEntity): Observable<T> {
    return this._converter.from(obj)
      .flatMap(entity => {
        return this._baseRepo.save$(entity)
      });
  }

  findByExternalIdAndUpdate$(obj: IEntity): Observable<T> {
    return Observable.of(<T>{})
  }  

  findEachByExternalIdAndUpdate$(obj: IEntity[]): Observable<T[]> {
    return Observable.of([<T>{}])
  }  

  findByExternalId$(id: string|number): Observable<T> {
		let extRefIdKey = `externalReference.${this.Provider}.id`;
    
    return this.findOne$({ [extRefIdKey]: id }); 
  }  

  findByExternalIds$(ids: Array<string|number>): Observable<T[]> {
		let extRefIdKey = `externalReference.${this.Provider}.id`;

    return this.findAll$({ [extRefIdKey]: { $in : ids } });
  }
  
  insert$(obj: IEntity): Observable<T> {
    return this._baseRepo.insert$(obj);
  }

  insertMany$(objs: IEntity[]): Observable<T[]> {
    return this._baseRepo.insertMany$(objs);
  }

  findByIdAndUpdate$(id: string, update: any): Observable<T> {
    return this._baseRepo.findByIdAndUpdate$(id, update);   
  }
    
  findOneAndUpdate$(conditions: any, update: any): Observable<T> {
    return this._baseRepo.findOneAndUpdate$(conditions, update);   
  }

  findAll$(conditions?: any): Observable<T[]> {
    return this._baseRepo.findAll$(conditions);
  }

  findById$(id: string) {
    return this._baseRepo.findById$(id);
  }  

  findOne$(conditions: any) {
    return this._baseRepo.findOne$(conditions);
  }
}