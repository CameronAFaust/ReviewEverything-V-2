const httpClient = require('https');

API_KEY = 'cb9a5be66beef417c07e14d9492341c3';
genres = [
  {
    id: 28,
    name: "Action"
  },
  {
    id: 12,
    name: "Adventure"
  },
  {
    id: 16,
    name: "Animation"
  },
  {
    id: 35,
    name: "Comedy"
  },
  {
    id: 80,
    name: "Crime"
  },
  {
    id: 99,
    name: "Documentary"
  },
  {
    id: 18,
    name: "Drama"
  },
  {
    id: 10751,
    name: "Family"
  },
  {
    id: 14,
    name: "Fantasy"
  },
  {
    id: 36,
    name: "History"
  },
  {
    id: 27,
    name: "Horror"
  },
  {
    id: 10402,
    name: "Music"
  },
  {
    id: 9648,
    name: "Mystery"
  },
  {
    id: 10749,
    name: "Romance"
  },
  {
    id: 878,
    name: "Science Fiction"
  },
  {
    id: 10770,
    name: "TV Movie"
  },
  {
    id: 53,
    name: "Thriller"
  },
  {
    id: 10752,
    name: "War"
  },
  {
    id: 37,
    name: "Western"
  }
]
// MOVIE
function getMovieDetailsById(MovieId){
  return this.httpClient.get(`https://api.themoviedb.org/3/movie/${MovieId}?api_key=${this.API_KEY}&language=en-US`);
}
function getMovieIdByName(MovieName){
  return this.httpClient.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=en-US&query=${MovieName}&page=1&include_adult=false`);
}
function getActorsInMovie(MovieId){
  return this.httpClient.get(`https://api.themoviedb.org/3/movie/${MovieId}/credits?api_key=${this.API_KEY}`);
}
function getMovieRecommendations(MovieId){
  return this.httpClient.get(`https://api.themoviedb.org/3/movie/${MovieId}/recommendations?api_key=${this.API_KEY}`);
}
// ACTOR
function getActorIdByName(ActorName){
  return this.httpClient.get(`https://api.themoviedb.org/3/search/person?api_key=${this.API_KEY}&language=en-US&query=${ActorName}&include_adult=false`);
}
function getActorMoviesById(ActorId){
  return this.httpClient.get(`https://api.themoviedb.org/3/person/${ActorId}/movie_credits?api_key=${this.API_KEY}&language=en-US`);
}
// GENRE
function getGenreMoviesById(genreName){
  let genreId;
  this.genres.forEach(genre => {
    if (genre.name == genreName) {
      genreId = genre.id
    }
  });
  return this.httpClient.get(`https://api.themoviedb.org/3/discover/movie?api_key=${this.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId} `);
}

// popular movie
function getPopularMovies(){
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        // return(JSON.parse(data))
        popularMovies = JSON.parse(data).results;
        popularMovies.length = 6;
        popularMovies.forEach(movie => {
          if (movie.title.length > 35) {
            movie.title = movie.title.substring(0, 35);
            movie.title += "...";
          }
        });
        // console.log(popularMovies[0]);
        resolve(popularMovies)
      });
    });
  });
}
// popular People
function getPopularPeople(){
  // return this.httpClient.get(`https://api.themoviedb.org/3/trending/person/week?api_key=${this.API_KEY}&language=en-US&page=1`)
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/trending/person/week?api_key=${API_KEY}&language=en-US&page=1`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        // return(JSON.parse(data))
        popularPeople = JSON.parse(data).results;
        popularPeople.length = 6;
        resolve(popularPeople)
      });
    });
  });
}

module.exports = {
  getPopularMovies,
  getPopularPeople
}