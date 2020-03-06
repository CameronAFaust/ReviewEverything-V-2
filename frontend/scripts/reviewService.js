var MongoClient = require('mongodb').MongoClient

var settings = {
  reconnectTries : Number.MAX_VALUE,
  autoReconnect : true
};


function getReviews(movie_id) {
  return new Promise(resolve => {
    MongoClient.connect('mongodb://localhost:27017/ReviewEverything', settings, function (err, client) {
      if (err) console.log(err)
    
      var db = client.db('ReviewEverything')    
      
      var query = { movie_id: `${movie_id}` };
      db.collection('reviews').find(query).toArray(function (err, result) {
        if (err) console.log(err)
        resolve(result)
      })
    })
  });
}

function createReview(movie_id, user_id, username, review, rating) {
  return new Promise(resolve => {
    MongoClient.connect('mongodb://localhost:27017/ReviewEverything', settings, function (err, client) {
      if (err) console.log(err)
      var db = client.db('ReviewEverything')
      
      let newReview = {review_text: review, rating: rating, movie_id: movie_id, username: username, user_id: user_id};
      
      db.collection('reviews').insertOne(newReview, function (err, result) {
        if (err) console.log(err)
        resolve(result)
      })
    })
  });
}

function editReview(review_id, review, rating) {
  return new Promise(resolve => {
    MongoClient.connect('mongodb://localhost:27017/ReviewEverything', settings, function (err, client) {
      if (err) console.log(err)
      var db = client.db('ReviewEverything')
      
      let newReview = {review_text: review, rating: rating};
      
      db.collection('reviews').update({id: review_id}, newReview, function (err, result) {
        if (err) console.log(err)
        resolve(result)
      })
    })
  });
}

function deleteReview(review_id) {
  return new Promise(resolve => {
    MongoClient.connect('mongodb://localhost:27017/ReviewEverything', settings, function (err, client) {
      if (err) console.log(err)
      var db = client.db('ReviewEverything')
      
      db.collection('reviews').deleteOne({id: review_id}, function (err, result) {
        if (err) console.log(err)
        resolve(result)
      })
    })
  });
}



module.exports = {
  getReviews,
  createReview,
  editReview,
  deleteReview
}