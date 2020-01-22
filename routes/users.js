var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var User = require("../models/UserSchema");

const passport = require("passport");
const { forwardAuth } = require("../config/auth");

/* GET halaman login */
router.get("/login", forwardAuth, function(req, res, next) {
  res.render("login", { title: "Halaman Login" });
});

/* GET halaman register */
router.get("/register", forwardAuth, function(req, res, next) {
  res.render("register", { title: "Halaman Register" });
});

/* POST action register */
router.post("/register", forwardAuth, function(req, res) {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Silahkan Lengkapi Data Anda" });
  }

  if (password != password2) {
    errors.push({ msg: "Password Tidak Sama" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email Sudah Ada" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        newUser
          .save()
          .then(user => {
            console.log("Selamat Anda Berhasil Registrasi, Silahkan Login");
            res.redirect("/auth/login");
          })
          .catch(err => console.log(err));
      }
    });
  }
});

/* POST action login */
router.post("/login", forwardAuth, function(req, res, next) {
  const { email, password } = req.body;

  let errors = [];

  if (!email || !password) {
    errors.push({ msg: "Silahkan Lengkapi Data Anda" });
  }
  if (errors.length > 0) {
    res.render("login", { errors, email, password });
  } else {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/auth/login",
      failureFlash: true
    })(req, res, next);
  }
});

/* GET action logout */
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
