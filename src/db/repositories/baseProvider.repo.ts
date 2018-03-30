import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document } from 'mongoose';

import { BaseRepository, IBaseRepository } from '../repositories/base.repo';
import { IEntity } from '../models/base.model';
import { IConverter } from '../converters/converter';
import { FootballApiProvider as ApiProvider } from '../../common/footballApiProvider';

export interface IBaseProviderRepository<T extends IEntity> extends IBaseRepository<T> {
  Provider: ApiProvider;
  findByExternalIdAndUpdate$(obj: IEntity): Observable<T>;
  findEachByExternalIdAndUpdate$(obj: IEntity[]): Observable<T[]>;
  getByExternalId$(id: string|number): Observable<T>;  
  getByExternalIds$(ids: Array<string|number>): Observable<T[]>;
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

  getByExternalId$(id: string|number): Observable<T> {
    return Observable.of(<T>{})    
  }  

  getByExternalIds$(): Observable<T[]> {
    return Observable.of([<T>{}])
  }

  findByIdAndUpdate$(id: string | number, update: any): Observable<T> {
    return this._baseRepo.findByIdAndUpdate$(id, update);   
  }
    
  findOneAndUpdate$(conditions: any, update: any): Observable<T> {
    return this._baseRepo.findOneAndUpdate$(conditions, update);   
  }

  findAll$(): Observable<T[]> {
    return this._baseRepo.findAll$();
  }
}