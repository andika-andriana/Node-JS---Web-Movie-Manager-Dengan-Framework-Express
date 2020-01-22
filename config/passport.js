const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/UserSchema");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, function(
      email,
      password,
      done
    ) {
      User.findOne({ email: email }).then(user => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password Anda Salah / Tidak Sesuai"
            });
          }
        } else {
          return done(null, false, {
            message: "Email Anda Belum Terdaftar"
          });
        }
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
