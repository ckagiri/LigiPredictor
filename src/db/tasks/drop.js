"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const index_1 = require("../../config/environment/index");
function drop() {
    console.log('dropping db..');
    mongoose.connect(index_1.config.mongo.uri);
    mongoose.connection.on('open', () => {
        mongoose.connection.dropDatabase().then(() => {
            mongoose.connection.close();
            console.log('db dropped');
        });
    });
}
drop();
//# sourceMappingURL=drop.js.map