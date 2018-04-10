import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';
import { ScorePoints, Score } from '../../common/score';

export enum PredictionStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED'
}

export interface IPrediction extends IEntity {
  id?: string;        
  user: string;
  fixture: string;
  fixtureSlug?: string; 
  season?: string;
  gameRound?: number;
  choice: Score;
  points?: ScorePoints;
  status?: PredictionStatus;
  hasJoker?: boolean;
  jokerAutoPicked?: boolean,  
}

export interface IPredictionModel extends IPrediction, Document {
  id?: string;        
}

const { String, Number, Boolean, ObjectId, Mixed } = Schema.Types;
const Status = PredictionStatus;

const predictionSchema = new Schema({
  user: { type: ObjectId, ref: 'User', required: true	},
	fixture: { type: ObjectId, ref: 'Fixture', required: true,index: true },
	fixtureSlug: { type: String, required: true, trim: true },
	season: { type: ObjectId, ref: 'Season', index: true },
  gameRound: { type: Number },
	choice: {
		goalsHomeTeam: { type: Number },
		goalsAwayTeam: { type: Number	},
		isComputerGenerated: { type: Boolean, default: true }
	},
	timestamp: { type: Schema.Types.Date,	default: Date.now() },
	scorePoints: {
    points: { type: Number },
    pointsFor: { type: Number },
    pointsAgainst: { type: Number },
    MatchOutcomePoints: { type: Number },
    GoalDifferencePoints: { type: Number },
    ExactScorePoints: { type: Number },
    ScoreDifferencePoints: { type: Number },
    TeamScorePoints: { type: Number }
  },
	hasJoker: { type: Boolean, default: false },
	jokerAutoPicked: { type: Boolean, default: false },
  status: {
    type: String,
    enum: [Status.PENDING, Status.PROCESSED],
		default: Status.PENDING
  }
});

export const PredictionModel = model<IPredictionModel>('Prediction', predictionSchema);