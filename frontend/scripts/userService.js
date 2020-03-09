var MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

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
          bcrypt.compare(password, result[0].password).then((res) => {
            if (res) {
              // localStorage.setItem('userId', result[0].id);
              // localStorage.setItem('username', result[0].username);
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

        db.collection("users").update({ id: user_id }, updatedUser, function(
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

        db.collection("users").deleteOne({ id: user_id }, function(
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

module.exports = {
  login,
  signup,
  editUser,
  deleteUser
};
