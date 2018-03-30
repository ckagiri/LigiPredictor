import { Model, Document, Types, Query } from "mongoose";

import { IEntity } from '../models/base.model';

export class DocumentDao<T extends Document> {
  protected _model: Model<Document>;
  
  constructor(schemaModel: Model<Document>){
    this._model = schemaModel;
  }  
    
  save(obj: IEntity): Promise<T> {
    const model = new this._model(obj) as T;
    return model.save();
  }
}