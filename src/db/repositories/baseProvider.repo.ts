import { Observable, Observer, Subscriber } from 'rxjs';
import { Model, Document, Query, SaveOptions } from 'mongoose';

import { BaseRepository } from '../repositories/base.repo';
import { IEntity } from '../models/base.model';
import { IConverter } from '../converters/converter';

export interface IBaseProviderRepository<T extends Document> {
  save$(obj: IEntity): Observable<T>;
}

export class BaseProviderRepository<T extends Document> extends BaseRepository<T> implements IBaseProviderRepository<T> {
  protected _converter: IConverter;

  constructor(schemaModel: Model<Document>, converter: IConverter) {
    super(schemaModel);
    this._converter = converter;
  }

  save$(obj: IEntity): Observable<T> {
    return this._converter.from(obj)
      .flatMap(entity => {
        return this.save$(entity);
      });
  }
}