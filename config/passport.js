const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

//how to store user in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, username, password, done) => {
      //use express-validator to check
      req
        .checkBody("username", "Invalid username")
        .notEmpty()
        .isLength({ min: 4 });
      req
        .checkBody("email", "Invalid email")
        .notEmpty()
        .isEmail();
      req
        .checkBody("password", "Invalid password")
        .notEmpty()
        .isLength({ min: 4 });

      let errors = req.validationErrors();
      let messages = [];
      if (errors) {
        errors.forEach(error => {
          messages.push(error.msg);
        });
        return done(null, false, req.flash("signupErrors", messages));
      }

      let email = req.body.email;
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (user) {
          return done(
            null,
            false,
            req.flash("signupErrors", "This email has been taken")
          );
        }
        console.log("making a new user");
        const newUser = new User();
        newUser.email = email;
        newUser.username = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
          if (err) {
            console.log(err);
            return done(err);
          }
          return done(null, newUser);
        });
      });
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, username, password, done) {
      req.checkBody("username", "Invalid username").notEmpty();
      req.checkBody("password", "Invalid password").notEmpty();

      let errors = req.validationErrors();
      if (errors) {
        let messages = [];
        errors.forEach(error => {
          messages.push(error.msg);
        });
        return done(null, false, req.flash("loginErrors", messages));
      }

      User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(
            null,
            false,
            req.flash("loginErrors", "No username found")
          );
        }
        if (!user.validPassword(password)) {
          return done(
            null,
            false,
            req.flash("loginErrors", "Password is incorrect")
          );
        }
        return done(null, user);
      });
    }
  )
);
