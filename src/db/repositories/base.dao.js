"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const document_dao_1 = require("../repositories/document.dao");
class BaseDao extends document_dao_1.DocumentDao {
    save$(obj) {
        return rxjs_1.Observable.create((observer) => {
            this.save(obj).then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    insert$(obj) {
        return rxjs_1.Observable.create((observer) => {
            this.insert(obj).then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    insertMany$(objs) {
        return rxjs_1.Observable.create((observer) => {
            this.insertMany(objs).then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    findByIdAndUpdate$(id, update) {
        return rxjs_1.Observable.create((observer) => {
            super.findByIdAndUpdate(id, update).exec().then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    findOneAndUpdate$(conditions, update) {
        return rxjs_1.Observable.create((observer) => {
            super.findOneAndUpdate(conditions, update).exec().then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    findAll$(conditions, projection, options) {
        return rxjs_1.Observable.create((observer) => {
            super.findAll(conditions, projection, options).exec().then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    findOne$(conditions, projection) {
        return rxjs_1.Observable.create((observer) => {
            super.findOne(conditions).exec().then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    findById$(id) {
        return rxjs_1.Observable.create((observer) => {
            super.findById(id).exec().then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    remove$(id) {
        return rxjs_1.Observable.create((observer) => {
            super.remove(id).exec().then(() => {
                observer.next();
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    count$(conditions) {
        return rxjs_1.Observable.create((observer) => {
            super.count(conditions).exec().then((result) => {
                observer.next(result);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
}
exports.BaseDao = BaseDao;
//# sourceMappingURL=base.dao.js.map