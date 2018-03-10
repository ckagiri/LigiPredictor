import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { IEntity } from './base.model';

export interface ILeague extends IEntity {
  name: string;
  slug: string;
  code: string;
}

export interface ILeagueModel extends ILeague, mongoose.Document {  
}

export const leagueSchema = new Schema({
  name: {
    type:  String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: ''
  }
});

// This try-catch is added so that it is possible to set a watch
// on the mocha runner. Every time the test runs, it will try
// to create the add the model again

export const LeagueModel = mongoose.model<ILeagueModel>('League', leagueSchema);

//module.exports = LeagueModel;
