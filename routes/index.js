var express = require("express");
var router = express.Router();

const { CekAuth, forwardAuth } = require("../config/auth");

/* GET halaman welcome */
router.get("/", forwardAuth, function(req, res, next) {
  res.render("welcome", { title: "Halaman Welcome" });
});

/* GET halaman dashboard */
router.get("/dashboard", CekAuth, function(req, res, next) {
  res.render("dashboard");
});

module.exports = router;
