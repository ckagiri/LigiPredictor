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

  saveMany(objs: IEntity[]): Promise<T[]> {
    return this._model.create(objs) as Promise<T[]>
  }

  insert(obj: IEntity): Promise<T> {
    return this._model.create(obj) as Promise<T>
  }

  insertMany(objs: IEntity[]): Promise<T[]> {
    return this._model.insertMany(objs) as Promise<T[]>
  }

  findAll(conditions: any = {}, projection?: any, options?: any){
    return this._model.find(conditions, projection, options);
  }

  findOne(conditions: any, projection?: any) {
		return this._model.findOne(conditions, projection);
  }

  findById(id: string) {
    return this._model.findById(id)
  }
  
  findByIdAndUpdate(id: string, update: any, options: any = { overwrite: false, new: true }) {
    return this._model.findByIdAndUpdate(id, update, options);
  }

  findOneAndUpdate(conditions: any, update: any, options: any = { overwrite: false, new: true }){
    return this._model.findOneAndUpdate(conditions, update, options);
  }

  remove(id: string) {
		return this._model.remove({ _id: id });
	}

	count (conditions: any) {
		return this._model.count(conditions);
	}
}