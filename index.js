const express = require('express');

const app = express()

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',  // route user is sent to after user grants permission
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

const PORT = process.env.PORT || 5000;
app.listen(PORT)
