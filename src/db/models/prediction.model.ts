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
  user: string;
  fixture: string;
  choice: Choice;
  points?: ScorePoints;
  status?: PredictionStatus;
}

export interface IPredictionModel extends IPrediction, Document {}

const predictionSchema = new Schema({

});

export const PredictionModel = model<IPredictionModel>('Prediction', predictionSchema);