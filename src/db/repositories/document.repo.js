"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocumentRepository {
    constructor(schemaModel) {
        this._model = schemaModel;
    }
    save(obj) {
        const model = new this._model(obj);
        return model.save();
    }
}
exports.DocumentRepository = DocumentRepository;
//# sourceMappingURL=document.repo.js.map