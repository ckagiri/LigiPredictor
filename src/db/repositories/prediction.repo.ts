import { Observable } from 'rxjs';
import { Document } from 'mongoose';

import { IPrediction, IPredictionModel, PredictionModel } from '../models/prediction.model';
import { IBaseRepository, BaseRepository } from './base.repo';

export interface IPredictionRepository {
  getOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]): Observable<IPrediction>;  
  findOneOrCreate$(userId: string, fixtureId: string): Observable<IPrediction>;
}

export class PredictionRepository implements IPredictionRepository {
  private _baseRepo: IBaseRepository<IPredictionModel>;

  static getInstance() {
    return new PredictionRepository();
  }

  constructor() {
    this._baseRepo = new BaseRepository<IPredictionModel>(PredictionModel)
  }

  getOrCreateJoker$(userId: string, seasonId: string, gameRound: number, pick: string[]): Observable<IPrediction> {
    return Observable.of(<IPrediction>{})
  }

  findOneOrCreate$(userId: string, fixtureId: string): Observable<IPrediction> {
    return Observable.of(<IPrediction>{})
  }  
}