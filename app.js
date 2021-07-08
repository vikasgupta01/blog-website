//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// Load the full build. (lodash)
const _ = require('lodash');
const { xor } = require("lodash");


const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect('mongodb+srv://vikasgupta01:EatKitkatPls@gettingstarted.g891c.mongodb.net/blogWebsiteDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title : String,
  body : String
});

const Post = new mongoose.model("Post", postSchema);

// let posts = [];

const homeStartingContent =
  "This is homepage of the website, you can see all the blog posts here. Click on 'Read More' to open full post.";
const aboutContent =
  "Hi, this is a simple blogging platform. You can read pre-exiting blogs from homepage and then navigate to the post-specific page by clicking on 'Read More'. You can also create blogs from compose section, and after you submit, it gets reflected in homepage. It was created using node-express for backend, mongoDB-mongoose for database and EJS for views. You can see the code on 'https://github.com/vikasgupta01/blog-website'.";
const contactContent =
  "Drop us a email on Email ID : public.vikasgupta@gmail.com or Dial : +91-99xyz-xyz99";


app.get("/", function (req, res) {
  Post.find({}, function(err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {homePara : homeStartingContent, posts: foundPosts});
    }
  })
  // res.render("home", { homePara: homeStartingContent, posts: posts});
});

app.get("/about", function (req, res) {
  res.render("about", { aboutPara: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactPara: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // const post = {title : req.body.postTitle, body : req.body.postBody, route : _.kebabCase(req.body.postTitle)};
  const newPost = new Post({
    title : req.body.postTitle,
    body : req.body.postBody
  });

  newPost.save(() => res.redirect('/'));
  // posts.push(blog);

  // res.redirect("/");
});

// uses dynamic url
app.get("/posts/:postID", function(req, res) {
  const postID = req.params.postID;
  Post.findOne({_id: postID}, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {title: foundPost.title, content: foundPost.body, _id: postID})
    }
  })
});


app.get("/home", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
