import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ILeague extends IEntity {
  name: string;
  slug?: string;
  code?: string;
}

interface ILeagueModel extends ILeague, Document { }

const { String } = Schema.Types;

export const leagueSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  code: { type: String, default: '' }
});

export const LeagueModel = model<ILeagueModel>('League', leagueSchema);