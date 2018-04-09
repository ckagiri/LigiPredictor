import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';
import { ScorePoints } from './userScore.model';

export enum PredictionStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED'
}

interface Choice {
	goalsHomeTeam: number;
  goalsAwayTeam: number;
}

export interface IPrediction extends IEntity {
  id?: string;        
  user: string;
  fixture: string;
  choice: Choice;
  points?: ScorePoints;
  status?: PredictionStatus;
  hasJoker?: boolean;
}

export interface IPredictionModel extends IPrediction, Document {
  id?: string;        
}

const predictionSchema = new Schema({

});

export const PredictionModel = model<IPredictionModel>('Prediction', predictionSchema);