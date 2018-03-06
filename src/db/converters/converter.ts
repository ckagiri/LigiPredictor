import { Observable } from 'rxjs';
import { IEntity } from '../models/base.model';

export interface IConverter {
  convert(data: any): Observable<IEntity>; 
}