import { assert, expect } from 'chai';
import { Observable } from 'rxjs';
import * as sinon from 'sinon';
import { Document } from 'mongoose';

import { IEntity } from '../../src/db/models/base.model';
import { IBaseRepository } from '../../src/db/repositories/base.repo';

const entity: IEntity = {
  name: 'abc'
};
let mockBaseRepo: IBaseRepository<Document> = {
  save$(obj: IEntity): Observable<Document> {
    return Observable.create((observer) => {
      observer.next(entity);
      observer.complete();
    }); 
  }
}

describe('BaseRepo', () => {
  let repo: IBaseRepository<Document>;

  it('should save an entity', (done) => {
    let saveSpy = sinon.spy(mockBaseRepo, 'save$');
    mockBaseRepo.save$(entity).subscribe((obj => {
      assert.isTrue(saveSpy.calledOnce);
      assert.equal(saveSpy.firstCall.args[0].name, 'abc');
      assert.equal(obj['name'], 'abc');
      saveSpy.restore();
      done();
    }));   
  })
})