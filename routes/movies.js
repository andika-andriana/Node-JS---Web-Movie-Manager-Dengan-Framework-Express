var express = require("express");
var router = express.Router();
var Movie = require("../models/MovieSchema");
var moment = require("moment");

const { CekAuth } = require("../config/auth");

/* GET halaman all movies */
router.get("/", CekAuth, function(req, res, next) {
  let ListMovies = [];
  Movie.find(function(err, movies) {
    if (movies) {
      for (let data of movies) {
        ListMovies.push({
          id: data.id,
          name: data.name,
          released_on: data.released_on
        });
      }
      res.render("movie/allMovies", { ListMovies });
    } else {
      ListMovies.push({
        id: "",
        name: "",
        released_on: ""
      });
    }
    res.render("movie/allMovies", { ListMovies });
  });
});

/* GET halaman create movies */
router.get("/create", CekAuth, function(req, res, next) {
  res.render("movie/createMovies", { title: "Halaman Create Movies" });
});

/* GET halaman update movies */
router.get("/update/:movieId", CekAuth, function(req, res, next) {
  Movie.findById(req.params.movieId, function(err, movieInfo) {
    var newDate = moment(movieInfo.released_on).format("YYYY-MM-DD");
    if (movieInfo) {
      console.log(movieInfo);
      res.render("movie/updateMovies", {
        movies: movieInfo,
        newDate
      });
    }
  });
});

/* POST action create movies */
router.post("/create", CekAuth, function(req, res) {
  const { name, date } = req.body;

  let errors = [];

  if (!name || !date) {
    errors.push({ msg: "Silahkan Lengkapi Data Movie" });
  }
  if (errors.length > 0) {
    res.render("movie/createMovies", { errors });
  } else {
    const newMovie = Movie({
      name,
      released_on: date
    });
    newMovie
      .save()
      .then(movie => {
        errors.push({ msg: "Data Movie Berhasil Ditambah" });
        res.render("movie/createMovies", { errors });
      })
      .catch(err => console.log(err));
  }
});

/* POST action update movies */
router.post("/update", CekAuth, function(req, res) {
  let errors = [];
  Movie.findByIdAndUpdate(
    req.body.id,
    { name: req.body.name, released_on: req.body.date },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        errors.push({ msg: "Movie Berhasil Terupdate" });
        var newMovies = { _id: req.body.id, name: req.body.name };
        var newDate = moment(req.body.date).format("YYYY-MM-DD");
        res.render("movie/updateMovies", {
          movies: newMovies,
          newDate,
          errors
        });
      }
    }
  );
});

/* GET action delete movies */
router.get("/delete/:movieId", CekAuth, function(req, res) {
  Movie.findByIdAndDelete(req.params.movieId, function() {
    res.redirect("/movies");
  });
});

module.exports = router;
