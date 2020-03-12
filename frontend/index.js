var express = require('express');
var pug = require('pug');
var path = require('path');
const http = require('http');
const bodyParser = require('body-parser')
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const apiService = require("./scripts/apiService")
const reviewService = require("./scripts/reviewService")
const userService = require("./scripts/userService")

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use("/static", express.static(path.join(__dirname+'/public')));
app.use(bodyParser.urlencoded({ extended: true }))

var Recaptcha = require('express-recaptcha').RecaptchaV3;
//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha('6LcbFNsUAAAAAG0-UMKAT0SjzL8jc_h2cDXUu60o', '6LcbFNsUAAAAAEucUrmEwPfiOhghbHop936jnV-T', {callback:'cb'});
// Home page
app.get('/', recaptcha.middleware.render, async function(req, res){
  let [popularMovies, popularPeople] = await Promise.all([apiService.getPopularMovies(), apiService.getPopularPeople()]);
  let userid = localStorage.getItem('userId')
  res.render('index', {
    "popularMovies": popularMovies,
    "popularPeople": popularPeople,
    "currentUserId": userid,
    "captcha": res.recaptcha
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
  let userid = localStorage.getItem('userId')

  res.render('moviePage', {
    "movies": movieData,
    "movieCredits": movieCredits,
    "recommendations": recommendations,
    "reviews": reviews,
    "movieID": req.params.id,
    "currentUserId": userid
  });
});

// When the user uses the search bar
app.get('/search', async function(req, res){
  res.redirect(`/search/${req.query.typeOfSearch}/${req.query.movieSearch}`);
});

// Search page
app.get('/search/:type/:id/:actorName?', async function(req, res){
  let currentUserId = localStorage.getItem('userId');
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
  let userid = localStorage.getItem('userId')

  res.render('search', {
    "searchList": searchList,
    "searchDescription": searchDescription,
    "searchType": req.params.type,
    "currentUserId": currentUserId,
    "currentUserId": userid
  });  
});

// Profile page
app.get('/user/:userid', async function(req, res){
  let [checkUser, reviews] = await Promise.all([
    userService.getUser(req.params.userid),
    reviewService.getUsersReviews(req.params.userid)
  ]);
  await Promise.all(reviews.map(async (review) => {
    let temp = await apiService.getMovieDetailsById(review.movie_id);
    review['movie_name'] = temp.title
  }));
  
  let userid = localStorage.getItem('userId')
  res.render('profile', {
    "checkUser": checkUser,
    "reviews": reviews,
    "paramsId": req.params.userid,
    "currentUserId": userid
  });  
});

// Login handler
app.post('/login', async function(req, res) {
  await userService.login(req.body.email, req.body.password)
  res.redirect(`/`); 
});

// Logout handler
app.get('/logout', async function(req, res) {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  res.redirect(`/`); 
});

// Signup handler
app.post('/signup', async function(req, res) {
  let ren = await userService.signup(req.body.username, req.body.password, req.body.fname, req.body.lname, req.body.email)
  res.redirect(`/`);
});

// Create new review
app.post('/createReview/:movieID', async function(req, res) {
  console.log(req.body);
  
  await reviewService.createReview(req.params.movieID, localStorage.getItem('userId'), localStorage.getItem('username'),  req.body.ratingText, req.body.rating);
  res.redirect(`/movie/${req.params.movieID}`);
});

// Edit review
app.post('/editReview/:movieID/:reviewID?', async function(req, res) {
  console.log(req.body);
  
  if (req.params.reviewID) {
    await reviewService.editReview(req.params.reviewID, req.body.editText, req.body.rating);
  } else {
    await reviewService.editReview(req.body.reviewID, req.body.editText, req.body.rating);
  }
  res.redirect(`/movie/${req.params.movieID}`);
});

app.post('/editUser/:user_id', async function(req, res) {
  await userService.editUser(req.params.user_id, req.body.username, req.body.email);
  let usersReviews = await reviewService.getUsersReviews(req.params.user_id);

  await Promise.all(usersReviews.map(async (review) => {
    // Change the reviews username
    await reviewService.editReviewName(review._id, req.body.username)
  }));
  res.redirect(`/user/${req.params.user_id}`)
});



app.listen(3000);


// {email: "test@test.com"}