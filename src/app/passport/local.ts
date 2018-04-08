import { Strategy as LocalStrategy } from 'passport-local';

import { IUserModel, UserModel as User } from '../../db/models/user.model';

export const localStrategy = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      return done(null, false, { message: `Email ${email} not found. Please try again.` });
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        return done(null, false, { message: 'Password incorrect. Please try again.' });
      }

      return done(null, user);
    });
  });
});
