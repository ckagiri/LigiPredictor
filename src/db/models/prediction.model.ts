import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';
import { ScorePoints } from './userScore.model';

interface Choice {
	goalsHomeTeam: number;
  goalsAwayTeam: number;
}

export interface IPrediction extends IEntity {
  fixture: string
  choice: Choice,
  points?: ScorePoints
}

export interface IPredictionModel extends IPrediction, Document {}

const predictionSchema = new Schema({

});

export const PredictionModel = model<IPredictionModel>('Prediction', predictionSchema);