"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { String } = mongoose_1.Schema.Types;
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    local: {
        password: { type: mongoose_1.Schema.Types.String },
        required: false,
    },
    username: { type: String, unique: true, lowercase: true },
    displayName: { type: String },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String },
    imageUrl: { type: String },
    google: {
        id: { type: String },
        token: { type: String },
        email: { type: String },
        name: { type: String },
        imageUrl: { type: String },
        profileUrl: { type: String },
        required: false,
    },
    facebook: {
        id: { type: String },
        token: { type: String },
        email: { type: String },
        name: { type: String },
        imageUrl: { type: String },
        profileUrl: { type: String },
        required: false,
    },
    twitter: {
        id: { type: String },
        token: { type: String },
        displayName: { type: String },
        username: { type: String },
        imageUrl: { type: String },
        required: false,
    }
});
userSchema.pre('save', function save(next) {
    let user = this;
    if (!user.isModified('local.password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.local.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.local.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    let user = this;
    bcrypt.compare(candidatePassword, user.local.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        else {
            return cb(null, isMatch);
        }
    });
};
exports.UserModel = mongoose_1.model('User', userSchema);
//# sourceMappingURL=user.model.js.map