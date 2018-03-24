import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export enum FixtureStatus {
  SCHEDULED = 'SCHEDULED', 
  TIMED = 'TIMED', 
  IN_PLAY = 'IN_PLAY', 
  CANCELED = 'CANCELED', 
  POSTPONED = 'POSTPONED', 
  FINISHED = 'FINISHED'
}

export interface IFixture extends IEntity {
  season: string;
  slug?: string;
	date?: any;
  matchRound?: number;
  status?: string;
  homeTeam?: {
    name: string, 
    slug: string,
    crestUrl: string,
    id: string
  };
  awayTeam?: {
    name: string,
    slug: string,
    crestUrl: string,
    id: string
  };
  odds?: {
    homeWin:number,
    awayWin: number,
    draw: number
  };
  venue?: string;
  externalReference?: any;
}

interface IFixtureModel extends IFixture, Document { }

const { String, Number, Date, Boolean, ObjectId, Mixed } = Schema.Types;

export const fixtureSchema = new Schema({
  season: { type: ObjectId,  ref: 'Season', index: true, required: true },
  slug: { type: String, required: true, trim: true },
  matchRound: { type: Number, required: true },
 	date: { type: Date, required: true	},  
	homeTeam: {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    crestUrl: { type: String },
    id: { type: ObjectId, ref: 'Team', index: true, required: true }
  },
  awayTeam: {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    crestUrl: { type: String },
    id: { type: ObjectId, ref: 'Team', index: true, required: true }
  },
  status: { 
    type: String, required: true,
    enum: ['SCHEDULED', 'TIMED', 'IN_PLAY', 'CANCELED', 'POSTPONED', 'FINISHED']
  },
  result: {
    goalsHomeTeam: { type: Number },
    goalsAwayTeam: { type: Number }
  },
  odds: {
    homeWin: { type: Number, default: 1 },
    awayWin: { type: Number, default: 1 },
    draw: { type: Number, default: 1 }
  },
  venue: { type: String, trim: true },
  allPredictionsProcessed: { type: Boolean, default: false },
  externalReference: { type: Mixed }  
});

export const FixtureModel = model<IFixtureModel>('Fixture', fixtureSchema);