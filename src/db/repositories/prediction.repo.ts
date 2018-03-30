import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { IPrediction, IPredictionModel, PredictionModel } from '../models/prediction.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IPredictionRepository {
  getOrCreateJoker$(user: string, season: string, gameRound: number, pick: string[]): Observable<IPrediction>;  
}

export class PredictionRepository implements IPredictionRepository {
  private _baseRepo: IBaseRepository<IPredictionModel>;

  static getInstance() {
    return new PredictionRepository();
  }

  constructor() {
    this._baseRepo = new BaseRepository<IPredictionModel>(PredictionModel)
  }

  getOrCreateJoker$(): Observable<IPrediction> {
    return Observable.of(<IPrediction>{})
  }
}