"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    app.use((req, res, next) => {
        if (req.query.id) {
            req.query._id = req.query.id;
            delete req.query.id;
        }
        next();
    });
};
//# sourceMappingURL=global.middleware.js.map