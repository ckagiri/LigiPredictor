import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions } from 'mongoose';

import { DocumentDao } from '../repositories/document.dao';
import { IEntity } from '../models/base.model';

export interface IBaseDao<T extends IEntity> {
  save$(obj: IEntity): Observable<T>;
  findByIdAndUpdate$(id: string|number, update: any): Observable<T>;
  findOneAndUpdate$(conditions: any, update: any): Observable<T>;
  findAll$(conditions: any): Observable<T[]>;
}

export class BaseDao<T extends Document> extends DocumentDao<T> implements IBaseDao<T> {
  save$(obj: IEntity): Observable<T> {
		return Observable.create((observer: Subscriber<T>) => {
			this.save(obj).then((result: T) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error(error);
			});
    });
  }
  
  findByIdAndUpdate$(id: string | number, update: any): Observable<T> {
    return Observable.of(<T>{})    
  }
    
  findOneAndUpdate$(conditions: any, update: any): Observable<T> {
    return Observable.of(<T>{})    
  }

  findAll$(): Observable<T[]> {
    return Observable.of([<T>{}])
  }
}