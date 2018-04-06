import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions } from 'mongoose';

import { BaseDao, IBaseDao } from '../repositories/base.dao';
import { IEntity } from '../models/base.model';

export interface IBaseRepository<T extends IEntity> {
  save$(obj: IEntity): Observable<T>;
  insert$(obj: IEntity): Observable<T>;
  insertMany$(objs: IEntity[]): Observable<T[]>;  
  findByIdAndUpdate$(id: string, update: any): Observable<T>;
  findOneAndUpdate$(conditions: any, update: any): Observable<T>;
  findAll$(conditions?: any): Observable<T[]>;
  findById$(id: string): Observable<T>;
  findOne$(conditions?: any): Observable<T>;  
}

export class BaseRepository<T extends IEntity> implements IBaseRepository<T> {
  protected _baseDao: IBaseDao<Document>;  

  constructor(schemaModel: Model<Document>) {
    this._baseDao = new BaseDao<Document>(schemaModel);
  }
  
  save$(data: T) {
    return this._baseDao.save$(data)
      .catch( (error: any) => {
        return Observable.throw(error);
      })
      .map((data: T) => {
        return data;
      })
  }

  insert$(data: T) {
    return this._baseDao.insert$(data)
      .catch( (error: any) => {
        return Observable.throw(error);
      })
      .map((data: T) => {
        return data;
      })
  }

  insertMany$(data: T[]) {
    return this._baseDao.insertMany$(data)
      .catch( (error: any) => {
        return Observable.throw(error);
      })
      .map((data: T[]) => {
        return data;
      })
  }
  
  findByIdAndUpdate$(id: string, update: any) {
    return this._baseDao.findByIdAndUpdate$(id, update)
      .catch((error: any) => {
        return Observable.throw(error);
      })
      .map((data: T) => {
        return data;
      })     
  }
    
  findOneAndUpdate$(conditions: any, update: any) {
    return this._baseDao.findOneAndUpdate$(conditions, update)
      .catch((error: any) => {
        return Observable.throw(error);
      })
      .map((data: T) => {
        return data;
      })
  } 

  findAll$(conditions: any = {}) {
    return this._baseDao.findAll$(conditions)
      .catch((error: any) => {
				return Observable.throw(error);
			})
			.map((data: T[]) => {
				return data;
			})
  }

  findById$(id: string) {
    return this._baseDao.findById$(id)
      .catch((error: any) => {
        return Observable.throw( error );
      })
      .map((data: T) => {
        return data;
      })   
  }

  findOne$(conditions?: any ) {
		return this._baseDao.findOne$(conditions)
			.catch((error: any) => {
				return Observable.throw(error);
			})
			.map((data: T) => {
				return data;
			})
	}
}