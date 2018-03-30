import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface IUser extends IEntity {}

export interface IUserModel extends IUser, Document {}

const userSchema = new Schema({

});

export const UserModel = model<IUserModel>('User', userSchema);