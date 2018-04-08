"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const user_model_1 = require("../../db/models/user.model");
exports.localStrategy = new passport_local_1.Strategy({ usernameField: 'email' }, (email, password, done) => {
    user_model_1.UserModel.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: `Email ${email} not found. Please try again.` });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, { message: 'Password incorrect. Please try again.' });
            }
            return done(null, user);
        });
    });
});
//# sourceMappingURL=local.js.map