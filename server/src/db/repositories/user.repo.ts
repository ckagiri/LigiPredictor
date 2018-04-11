import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { IUser, IUserModel, UserModel } from '../models/user.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IUserRepository extends IBaseRepository<IUser> {  
}

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  static getInstance() {
    return new UserRepository();
  }

  constructor() {
    super(UserModel)
  }
}