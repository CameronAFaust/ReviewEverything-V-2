var express = require('express');
var pug = require('pug');
var path = require('path');

const apiService = require("./scripts/apiService")

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use(express.static(path.join(__dirname+'/public')));

app.get('/', async function(req, res){
  let popularMovies = await apiService.getPopularMovies();
  let popularPeople = await apiService.getPopularPeople();
  res.render('index', {
    "popularMovies": popularMovies,
    "popularPeople": popularPeople
  });
  
});

app.listen(3000);
