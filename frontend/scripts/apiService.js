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
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/movie/${MovieId}?api_key=${API_KEY}&language=en-US`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        movies = JSON.parse(data);
        if (!movies.runtime) {
          movies.runtime = 0;
        }
        if (!movies.budget) movies.budget = 0;
        if (!movies.revenue) movies.revenue = 0;
        movies.budget = movies.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        movies.revenue = movies.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        resolve(movies)
      });
    });
  });
}
function getMovieIdByName(MovieName){
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${MovieName}&page=1&include_adult=false`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        searchList = JSON.parse(data).results;        
        searchList.forEach(movie => {
          if (movie.title.length > 25) {
            movie.title = movie.title.substring(0, 25);
            movie.title += "...";
          }
        });
        searchList = searchList.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
        resolve(searchList);
      });
    });
  });
}
function getActorsInMovie(MovieId){
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/movie/${MovieId}/credits?api_key=${API_KEY}`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        movieCredits = JSON.parse(data);
        movieCredits = movieCredits.cast
        if (movieCredits) {
          if (movieCredits.length > 10) { movieCredits.length = 10; }
        } else {
          movieCredits = []
        }
        resolve(movieCredits);
      });
    });
  });
}
function getMovieRecommendations(MovieId){
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/movie/${MovieId}/recommendations?api_key=${API_KEY}`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        recommendations = JSON.parse(data);
        recommendations = recommendations.results;   
        if (recommendations) {
          if (recommendations.length > 6) { recommendations.length = 6; }
        } else {
          recommendations = []
        }
        resolve(recommendations);
      });
    });
  });
}
// ACTOR
function getActorIdByName(ActorName){
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${ActorName}&include_adult=false`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        searchList = JSON.parse(data).results;
        searchList.forEach(movie => {
          if (movie.name.length > 25) {
            movie.name = movie.title.substring(0, 25);
            movie.name += "...";
          }
        });
        searchList = searchList.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
        resolve(searchList);
      });
    });
  });
}
function getActorMoviesById(ActorId){
  return new Promise(resolve => {
    httpClient.get(`https://api.themoviedb.org/3/person/${ActorId}/movie_credits?api_key=${API_KEY}&language=en-US`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        searchList = JSON.parse(data).cast;
        searchList.forEach(movie => {
          if (movie.title.length > 25) {
            movie.title = movie.title.substring(0, 25);
            movie.title += "...";
          }
        });
        searchList = searchList.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
        resolve(searchList);
      });
    });
  });
  // return this.httpClient.get(`https://api.themoviedb.org/3/person/${ActorId}/movie_credits?api_key=${this.API_KEY}&language=en-US`);
}
// GENRE
function getGenreMoviesById(genreName){
  return new Promise(resolve => {
    let genreId;
    genres.forEach(genre => {
      if (genre.name == genreName) {
        genreId = genre.id
      }
    });
    httpClient.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`, (resp) => {
      let data = '';  
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      resp.on('end', () => {
        let searchList = JSON.parse(data).results;
        
        searchList.forEach(movie => {
          if (movie.title.length > 25) {
            movie.title = movie.title.substring(0, 25);
            movie.title += "...";
          }
        });
        searchList = searchList.sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
        resolve(searchList);
      });
    });
  });
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
  getPopularPeople,
  getMovieIdByName,
  getMovieDetailsById,
  getActorsInMovie,
  getMovieRecommendations,
  getActorIdByName,
  getActorMoviesById,
  getGenreMoviesById
}