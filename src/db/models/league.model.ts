import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ILeague extends IEntity {
  name: string;
  slug?: string;
  code?: string;
}

interface ILeagueModel extends ILeague, Document { }

export const leagueSchema = new Schema({
  name: { type:  Schema.Types.String, required: true },
  slug: { type: Schema.Types.String, required: true },
  code: { type: Schema.Types.String, default: '' }
});

export const LeagueModel = model<ILeagueModel>('League', leagueSchema);