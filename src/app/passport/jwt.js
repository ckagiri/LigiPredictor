"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = require("../../db/models/user.model");
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'casThor',
};
exports.jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, (payload, done) => {
    user_model_1.UserModel.findById(payload._id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    });
});
function generateToken(userInfo) {
    return jwt.sign(userInfo, jwtOptions.secretOrKey, {
        expiresIn: 10080,
    });
}
exports.generateToken = generateToken;
function getUserInfo(user) {
    return {
        _id: user._id,
        email: user.email,
    };
}
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=jwt.js.map