import { Schema, Model, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

import { IEntity } from './base.model';

export interface IUser extends IEntity {
  email: string;
  password?: string;
  isAdmin?: boolean;
	username?: string;
	displayName?: String;
  imageUrl?: string;
  comparePassword?: any;
  local: {
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
  let user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if(err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword: string, cb: Function) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    } else {
      return cb(null, isMatch);
    }
  });
};

export const UserModel = model<IUserModel>('User', userSchema);