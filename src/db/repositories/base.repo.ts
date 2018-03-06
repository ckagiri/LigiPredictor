import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions } from 'mongoose';

import { DocumentRepository } from '../repositories/document.repo';
import { IEntity } from '../models/base.model';

export class BaseRepository<T extends Document> extends DocumentRepository<T> {

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
}