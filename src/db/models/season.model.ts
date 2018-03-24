import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface ISeason extends IEntity {
  name: string;
  year: string;
  slug?: string;  
  league?: {
    name: string,
    slug: string,
    id: string
  }
	numberOfRounds?: number,
  currentMatchRound?: number,
  currentGameRound?: number,
	seasonStart?: any,
	seasonEnd?: any
  externalReference?: any
}

interface ISeasonModel extends ISeason, Document { }

const { String, Number, ObjectId, Mixed } = Schema.Types;

export const seasonSchema = new Schema({
  league: {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    id: { type: ObjectId, ref: 'League', index: true, required: true }
  },
  name: { type: String, required: true },
  slug: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  seasonStart: { type: Date, required: true },
	seasonEnd: { type: Date, required: true },
  currentMatchRound: { type: Number },
  currentGameRound: { type: Number },
	numberOfRounds: { type: Number },
	numberOfTeams: { type: Number },
	numberOfGames: { type: Number },
  externalReference: { type: Mixed }
});

export const SeasonModel = model<ISeasonModel>('Season', seasonSchema);