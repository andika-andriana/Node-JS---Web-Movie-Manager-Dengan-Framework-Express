var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

var expressLayout = require("express-ejs-layouts");
const database = require("./config/database");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var moviesRouter = require("./routes/movies");

var app = express();

// config passport
require("./config/passport")(passport);

// connection mongoDB
database.connection.on(
  "error",
  console.error.bind(console, "MongoDB Connection Error: ")
);

// view engine setup
app.use(expressLayout);
app.set("view engine", "ejs");

// express body-parser
app.use(express.urlencoded({ extended: true }));

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connectflash
app.use(flash());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// global variabel
app.use(function(req, res, next) {
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);
app.use("/auth", usersRouter);
app.use("/movies", moviesRouter);

module.exports = app;
