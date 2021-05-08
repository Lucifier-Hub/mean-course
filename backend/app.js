const express = require("express");
const bodyParser = require("body-parser");

const Post = require("./models/post");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
  console.log("sucees");
});

app.post((req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  res.status(201).json({ message: "Succesfully added" });
  console.log("sucess");
});

app.use("/api/posts", (req, res) => {
  const posts = [
    {
      id: "6s54das4d65as",
      title: "First title from server side",
      content: "First Content from server side",
    },
    {
      id: "6s54vdasdsadw",
      title: "Second title from server side",
      content: "Second Content from server side",
    },
  ];
  res.status(200).send({
    message: "Successfully fetched data",
    posts: posts,
  });
});

module.exports = app;
