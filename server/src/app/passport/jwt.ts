import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { UserModel as User } from '../../db/models/user.model';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'casThor',
};

export const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

export function generateToken(userInfo) {
  return jwt.sign(userInfo, jwtOptions.secretOrKey, {
    expiresIn: 10080,
  });
}

export function getUserInfo(user) {
  return {
    _id: user._id,
    email: user.email,
  };
}
