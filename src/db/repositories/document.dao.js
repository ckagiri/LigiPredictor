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
    saveMany(objs) {
        return this._model.create(objs);
    }
    insert(obj) {
        return this._model.create(obj);
    }
    insertMany(objs) {
        return this._model.insertMany(objs);
    }
    findAll(conditions = {}, projection, options) {
        return this._model.find(conditions, projection, options);
    }
    findOne(conditions, projection) {
        return this._model.findOne(conditions, projection);
    }
    findById(id) {
        return this._model.findById(id);
    }
    findByIdAndUpdate(id, update, options = { overwrite: false, new: true }) {
        return this._model.findByIdAndUpdate(id, update, options);
    }
    findOneAndUpdate(conditions, update, options = { overwrite: false, new: true }) {
        return this._model.findOneAndUpdate(conditions, update, options);
    }
    remove(id) {
        return this._model.remove({ _id: id });
    }
    count(conditions) {
        return this._model.count(conditions);
    }
}
exports.DocumentDao = DocumentDao;
//# sourceMappingURL=document.dao.js.map