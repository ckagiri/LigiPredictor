import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions, Types } from 'mongoose';

import { DocumentDao } from '../repositories/document.dao';
import { IEntity } from '../models/base.model';

export interface IBaseDao<T extends Document> {
  save$(obj: IEntity): Observable<T>;
  findByIdAndUpdate$(id: string, update: any): Observable<T>;
  findOneAndUpdate$(conditions: any, update: any): Observable<T>;
  findAll$(conditions?: any, projection?: any, options?: any): Observable<T[]>;
  findOne$(conditions: any, projection?: any);
  findById$(id: string): Observable<T>;
  remove$(id: string): Observable<void>;
  count$(conditions: any): Observable<number>;    
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
  
  findByIdAndUpdate$(id: string, update: any): Observable<T> {
		return Observable.create((observer: Subscriber<T>) => {
			super.findByIdAndUpdate(id, update).exec().then((result: T) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error( error );
			});
		});
	}
    
  findOneAndUpdate$(conditions: any, update: any): Observable<T> {
    return Observable.create((observer: Subscriber<T>) => {
			super.findOneAndUpdate(conditions, update).exec().then((result: T) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error(error);
			});
		}); 
  }

  findAll$(conditions?: any, projection?: any, options?: any): Observable<T[]> {
    return Observable.create((observer: Subscriber<T[]>) => {
			super.findAll(conditions, projection, options).exec().then((result: T[]) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error(error);
			});
		});
  }

  findOne$(conditions: any, projection?: any): Observable<T> {
		return Observable.create((observer: Subscriber<T>) => {
			super.findOne(conditions).exec().then((result: T) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error(error);
			});
		});
  }

  findById$(id: string): Observable<T> {
		return Observable.create((observer: Subscriber<T>) => {
			super.findById(id).exec().then((result: T) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error( error );
			});
		});
	}
  
  remove$(id: string): Observable<void> {
		return Observable.create( (observer: Subscriber<void>) => {
			super.remove(id).exec().then( () => {
				observer.next();
				observer.complete();
			}, (error: any) => {
				observer.error( error );
			});
		});
	}

	count$(conditions: any): Observable<number> {
		return Observable.create((observer: Subscriber<number>) => {
			super.count(conditions).exec().then((result: number) => {
				observer.next(result);
				observer.complete();
			}, (error: any) => {
				observer.error(error);
			});
		});
	}
}