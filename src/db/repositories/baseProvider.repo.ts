import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions } from 'mongoose';

import { BaseRepository, IBaseRepository } from '../repositories/base.repo';
import { IEntity } from '../models/base.model';
import { IConverter } from '../converters/converter';

export interface IBaseProviderRepository<T extends IEntity> {
  save$(obj: IEntity): Observable<T>;
  findByExternalIdAndUpdate$(obj: IEntity): Observable<T>;
  findEachByExternalIdAndUpdate$(obj: IEntity[]): Observable<T[]>;
  getByExternalId$(id: string|number): Observable<T>;  
  getByExternalIds$(): Observable<T[]>;
  findByIdAndUpdate$(id: string|number, update: any): Observable<T>;
  findOneAndUpdate$(conditions: any, update: any): Observable<T>;
}

export class BaseProviderRepository<T extends IEntity> implements IBaseProviderRepository<T> {
  protected _baseRepo: IBaseRepository<Document>;  
  protected _converter: IConverter;

  constructor(schemaModel: Model<Document>, converter: IConverter)
  constructor(schemaModel: Model<Document>, converter: IConverter, baseRepo?: IBaseRepository<Document>) {
    this._baseRepo = baseRepo || new BaseRepository<Document>(schemaModel);
    this._converter = converter;
  }

  save$(obj: IEntity): Observable<T> {
    return this._converter.from(obj)
      .flatMap(entity => {
        return this._baseRepo.save$(entity)
        .map(d => {
          const obj = Object.assign({}, d.toObject());
          return <T> obj;
        })
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
    return Observable.of(<T>{})    
  }
    
  findOneAndUpdate$(conditions: any, update: any): Observable<T> {
    return Observable.of(<T>{})    
  }
}