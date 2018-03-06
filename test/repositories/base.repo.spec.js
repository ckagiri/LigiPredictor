"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rxjs_1 = require("rxjs");
const sinon = require("sinon");
const entity = {
    name: 'abc'
};
let mockBaseRepo = {
    save$(obj) {
        return rxjs_1.Observable.create((observer) => {
            observer.next(entity);
            observer.complete();
        });
    }
};
describe('BaseRepo', () => {
    let repo;
    it('should save an entity', (done) => {
        let saveSpy = sinon.spy(mockBaseRepo, 'save$');
        mockBaseRepo.save$(entity).subscribe((obj => {
            chai_1.assert.isTrue(saveSpy.calledOnce);
            chai_1.assert.equal(saveSpy.firstCall.args[0].name, 'abc');
            chai_1.assert.equal(obj['name'], 'abc');
            saveSpy.restore();
            done();
        }));
    });
});
//# sourceMappingURL=base.repo.spec.js.map