import { Schema, Model, model } from 'mongoose';

import { IEntity } from './base.model';

export interface ILeague extends IEntity {
  name: string;
  slug: string;
  code: string;
}

export const leagueSchema = new Schema({
  name: { type:  Schema.Types.String, required: true },
  slug: { type: Schema.Types.String, required: true },
  code: { type: Schema.Types.String, default: '' }
});

export const LeagueModel = model('League', leagueSchema);