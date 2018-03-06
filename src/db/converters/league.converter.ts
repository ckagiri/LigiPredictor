import { Observable } from 'rxjs';

import { LigiLeagueConverter } from '../converters/league.converter.ligi';
import { IConverter } from './converter';
import { ILeague } from '../models/league.model';


export abstract class LeagueConverter implements IConverter {
  static getInstance() {
    return new LigiLeagueConverter();
  }

  abstract convert(data: any): Observable<ILeague>; 
}