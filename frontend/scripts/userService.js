var MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

var settings = {
  reconnectTries: Number.MAX_VALUE,
  autoReconnect: true
};

function login(email, password) {
  return new Promise(resolve => {
    MongoClient.connect(
      "mongodb://localhost:27017/ReviewEverything",
      settings,
      function(err, client) {
        if (err) console.log(err);
        var db = client.db("ReviewEverything");
        
        db.collection("users").find({ email: email }).toArray(function(err, result) {
          if (err) console.log(err);
          bcrypt.compare(password, result[0].password, function(err, res) {
            if (res) {
              localStorage.setItem('userId', result[0]._id);
              localStorage.setItem('username', result[0].username);
              resolve(true);
            }
            resolve(false);
          });
        });
      }
    );
  });
}

function signup(username, password, fname, lname, email) {
  return new Promise(resolve => {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        MongoClient.connect(
          "mongodb://localhost:27017/ReviewEverything",
          settings,
          function(err, client) {
            if (err) console.log(err);
            var db = client.db("ReviewEverything");

            let newUser = {
              username: username,
              fname: fname,
              lname: lname,
              email: email,
              password: hash
            };

            db.collection("users").insertOne(newUser, function(err, result) {
              if (err) console.log(err);
              localStorage.setItem('userId', result.ops[0]._id);
              localStorage.setItem('username', result.ops[0].username);
              resolve(result);
            });
          }
        );
      });
    });
  });
}

function editUser(user_id, username, email) {
  return new Promise(resolve => {
    MongoClient.connect(
      "mongodb://localhost:27017/ReviewEverything",
      settings,
      function(err, client) {
        if (err) console.log(err);
        var db = client.db("ReviewEverything");


        let updatedUser = { username: username, email: email };

        db.collection("users").update({ _id: ObjectId(user_id) }, {$set: updatedUser}, function(
          err,
          result
        ) {
          if (err) console.log(err);
          resolve(result);
        });
      }
    );
  });
}

function deleteUser(user_id) {
  return new Promise(resolve => {
    MongoClient.connect(
      "mongodb://localhost:27017/ReviewEverything",
      settings,
      function(err, client) {
        if (err) console.log(err);
        var db = client.db("ReviewEverything");

        db.collection("users").deleteOne({ _id: ObjectId(user_id) }, function(
          err,
          result
        ) {
          if (err) console.log(err);
          resolve(result);
        });
      }
    );
  });
}

function getUser(user_id) {
  return new Promise(resolve => {
    MongoClient.connect(
      "mongodb://localhost:27017/ReviewEverything",
      settings,
      function(err, client) {
        if (err) console.log(err);
        var db = client.db("ReviewEverything");

        db.collection("users").find({ _id: ObjectId(user_id) }).toArray(function(err, result) {
          if (err) console.log(err);
          resolve(result);
        });
      }
    );
  });
}

module.exports = {
  login,
  signup,
  editUser,
  deleteUser,
  getUser
};
