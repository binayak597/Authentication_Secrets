require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");




const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render('home');
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render('register');
});


app.post("/register", function(req, res){

    const userName = req.body.username;
    const password = req.body.password;
      const newUser = new User({
        email : userName,
        password : password
      });

      newUser.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.render('secrets');
        }
      });
});


app.post("/login", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email : userName}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
          if(foundUser.password === password){
            res.render('secrets');
          }
      }
    }
  });
});

app.listen(3000, function(){
  console.log("server is running on port 3000.");
});
