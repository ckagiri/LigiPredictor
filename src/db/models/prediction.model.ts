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
  scorePoints?: ScorePoints;
  status?: PredictionStatus;
  hasJoker?: boolean;
  jokerAutoPicked?: boolean;
}

export interface IPredictionModel extends IPrediction, Document {
  id?: string;        
}

const { String, Number, Boolean, ObjectId, Mixed } = Schema.Types;
const Status = PredictionStatus;

const predictionSchema = new Schema({
  user: { type: ObjectId, ref: 'User', required: true, index: true },
	fixture: { type: ObjectId, ref: 'Fixture', required: true, index: true },
	fixtureSlug: { type: String, trim: true },
	season: { type: ObjectId, ref: 'Season' },
  gameRound: { type: Number },
	choice: {
		goalsHomeTeam: { type: Number },
		goalsAwayTeam: { type: Number	},
		isComputerGenerated: { type: Boolean, default: true }
	},
	timestamp: { type: Schema.Types.Date,	default: Date.now() },
	scorePoints: {
    points: { type: Number },
    APoints: { type: Number },
    BPoints: { type: Number },
    MatchOutcomePoints: { type: Number },  
    TeamScorePlusPoints: { type: Number },
    GoalDifferencePoints: { type: Number },
    ExactScorePoints: { type: Number },
    TeamScoreMinusPoints: { type: Number }
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