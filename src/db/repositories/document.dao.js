"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocumentDao {
    constructor(schemaModel) {
        this._model = schemaModel;
    }
    save(obj) {
        const model = new this._model(obj);
        return model.save();
    }
}
exports.DocumentDao = DocumentDao;
//# sourceMappingURL=document.dao.js.map