import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions } from 'mongoose';

import { BaseDao, IBaseDao } from '../repositories/base.dao';
import { IEntity } from '../models/base.model';

export interface IBaseRepository<T extends IEntity> {
  save$(obj: IEntity): Observable<T>;
  findByIdAndUpdate$(id: string|number, update: any): Observable<T>;
  findOneAndUpdate$(conditions: any, update: any): Observable<T>;
  findAll$(conditions?: any): Observable<T[]>;
  findById$(id: string|number): Observable<T>;
}

export class BaseRepository<T extends IEntity> implements IBaseRepository<T> {
  protected _baseDao: IBaseDao<Document>;  

  constructor(schemaModel: Model<Document>) {
    this._baseDao = new BaseDao<Document>(schemaModel);
  }
  
  save$(data: T) {
    return this._baseDao.save$(data)
      .map(d => {
        const obj = Object.assign({}, d.toObject()) as T;
        return obj
      })
  }
  
  findByIdAndUpdate$(id: string | number, update: any) {
    return Observable.of(<T>{})    
  }
    
  findOneAndUpdate$(conditions: any, update: any) {
    return Observable.of(<T>{})    
  } 

  findAll$(conditions: any = {}) {
    return this._baseDao.findAll$(conditions)
      .flatMap(users => {
        return Observable.from(users);
      })
      .map(user => {
        return Object.assign({}, user.toObject()) as T;
      })
      .toArray();
  }

  findById$(id: string | number) {
    return Observable.of(<T>{})    
  }
}