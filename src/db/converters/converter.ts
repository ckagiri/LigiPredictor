import { Observable } from 'rxjs';
import { IEntity } from '../models/base.model';

export interface IConverter {
  from(data: any): Observable<IEntity>; 
  provider: string;
}