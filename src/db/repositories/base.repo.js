"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const document_repo_1 = require("../repositories/document.repo");
class BaseRepository extends document_repo_1.DocumentRepository {
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
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repo.js.map