var express = require('express');
var pug = require('pug');
var path = require('path');
const http = require('http');

const apiService = require("./scripts/apiService")
const reviewService = require("./scripts/reviewService")

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use("/static", express.static(path.join(__dirname+'/public')));

// Home page
app.get('/', async function(req, res){
  let [popularMovies, popularPeople] = await Promise.all([apiService.getPopularMovies(), apiService.getPopularPeople()]);
  res.render('index', {
    "popularMovies": popularMovies,
    "popularPeople": popularPeople
  });  
});

// Movie Page
app.get('/movie/:id', async function(req, res){
  let [movieData, movieCredits, recommendations, reviews] = await Promise.all([
    apiService.getMovieDetailsById(req.params.id), 
    apiService.getActorsInMovie(req.params.id), 
    apiService.getMovieRecommendations(req.params.id),
    reviewService.getReviews(req.params.id)
  ]); 
  
  res.render('moviePage', {
    "movies": movieData,
    "movieCredits": movieCredits,
    "recommendations": recommendations,
    "reviews": reviews
  });
});

// When the user uses the search bar
app.get('/search', async function(req, res){
  res.redirect(`/search/${req.query.typeOfSearch}/${req.query.movieSearch}`);
});

// Search page
app.get('/search/:type/:id/:actorName?', async function(req, res){
  if (req.params.type == 'title') {
    searchList = await apiService.getMovieIdByName(req.params.id);
    searchDescription = 'Movies search results for: "' + req.params.id + '"';
  } else if (req.params.type == 'actor') {
    searchList = await apiService.getActorIdByName(req.params.id);
    searchDescription = 'Actor search results for: "'  + req.params.id + '"';
  } else if (req.params.type == 'actors_movies') { 
    searchList = await apiService.getActorMoviesById(req.params.id);
    searchDescription = 'Movies with the actor: "' + req.params.actorName + '"';
  } else {
    searchList = await apiService.getGenreMoviesById(req.params.id);
    searchDescription = 'Genre search results for: "' + req.params.id + '"';
  }
  res.render('search', {
    "searchList": searchList,
    "searchDescription": searchDescription,
    "searchType": req.params.type
  });  
});


app.listen(3000);


