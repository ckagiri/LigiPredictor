import { Schema, Model, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

import { IEntity } from './base.model';

export interface IUser extends IEntity {
  id?: string;    
  email: string;
  isAdmin?: boolean;
  phone?: string;
	username?: string;
	displayName?: String;
  imageUrl?: string;
  comparePassword?: any;
  local?: {
    password?: string;
  };
  google?: {
    id: string,
    token: string,
    email: string,
    name: string,
    imageUrl: string,
    profileUrl: string,
  };
  facebook?: {
    id: string,
    token: string,
    email: string,
    name: string,
    imageUrl: string,
    profileUrl: string
  };
  twitter?: {
    id: string,
    token: string,
    displayName: string,
    username: string,
    imageUrl: string
  };
}

export interface IUserModel extends IUser, Document {
  id?: string;      
  comparePassword(candidatePassword: string, cb: Function): void;
}

const { String } = Schema.Types;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  local: {
    password: { type: Schema.Types.String },
    required: false,
  },
  username:  { type: String, unique: true, lowercase: true },
  displayName: { type: String },  
  isAdmin: { type: Boolean, default: false },    
  phone: { type: String },  
  imageUrl: { type: String },
  google: {
    id: { type: String },
    token: { type: String },
    email: { type: String },
    name: { type: String },
    imageUrl: { type: String },
    profileUrl: { type: String },
    required: false,
  },
  facebook: {
    id: { type: String },
    token: { type: String },
    email: { type: String },
    name: { type: String },
    imageUrl: { type: String },
    profileUrl: { type: String },
    required: false,
  },
  twitter: {
    id: { type: String },
    token: { type: String },
    displayName: { type: String },
    username: { type: String },
    imageUrl: { type: String },
    required: false,
  }
});

userSchema.pre('save', function save(next) {
  let user: IUserModel = this;
  console.log('ismod', user.isModified('local.password'))
  if (!user.isModified('local.password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if(err) { return next(err); }
    bcrypt.hash(user.local.password, salt, null, (err, hash) => {
      if(err) { return next(err); }
      user.local.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string, cb: Function) {
  let user: IUserModel = this;  
  bcrypt.compare(candidatePassword, user.local.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    } else {
      return cb(null, isMatch);
    }
  });
};

export const UserModel = model<IUserModel>('User', userSchema);