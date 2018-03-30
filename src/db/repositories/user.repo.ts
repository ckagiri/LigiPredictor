import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { IUser, IUserModel, UserModel } from '../models/user.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IUserRepository {
  findAll$(conditions?: any): Observable<IUser[]>;  
}

export class UserRepository implements IUserRepository {
  private _baseRepo: IBaseRepository<IUserModel>;

  static getInstance() {
    return new UserRepository();
  }

  constructor() {
    this._baseRepo = new BaseRepository<IUserModel>(UserModel)
  }

  findAll$(conditions: any = {}): Observable<IUser[]> {
    return this._baseRepo.findAll$(conditions)
      .flatMap(users => {
        return Observable.from(users);
      })
      .map(user => {
        return Object.assign({}, user.toObject()) as IUser;
      })
      .toArray();
  }
}