var express = require('express');
var pug = require('pug');
var path = require('path');

const apiService = require("./scripts/apiService")

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use("/static", express.static(path.join(__dirname+'/public')));

// Home page
app.get('/', async function(req, res){
  let popularMovies = await apiService.getPopularMovies();
  let popularPeople = await apiService.getPopularPeople();
  res.render('index', {
    "popularMovies": popularMovies,
    "popularPeople": popularPeople
  });  
});

// Movie Page
app.get('/movie/:id', async function(req, res){
  let movieData = await apiService.getMovieDetailsById(req.params.id);  
  let movieCredits = await apiService.getActorsInMovie(req.params.id);  
  let recommendations = await apiService.getMovieRecommendations(req.params.id);  
  res.render('moviePage', {
    "movies": movieData,
    "movieCredits": movieCredits,
    "recommendations": recommendations
  });  
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
