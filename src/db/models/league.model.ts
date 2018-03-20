import { Document, Schema, Model, model } from 'mongoose';

import { IEntity } from './base.model';

export interface ILeague extends IEntity {
  name: string;
  slug: string;
  code: string;
}

export interface ILeagueModel extends ILeague, Document {  
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

// add try-catch

export const LeagueModel: Model<ILeagueModel> = model<ILeagueModel>('League', leagueSchema);