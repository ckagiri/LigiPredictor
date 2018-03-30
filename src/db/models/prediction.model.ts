import { Schema, Model, model, Document } from 'mongoose';

import { IEntity } from './base.model';

export interface IPrediction extends IEntity {}

export interface IPredictionModel extends IPrediction, Document {}

const predictionSchema = new Schema({

});

export const PredictionModel = model<IPredictionModel>('Prediction', predictionSchema);