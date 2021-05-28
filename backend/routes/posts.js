const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.get("", (req, res) => {
  Post.find().then((documents) => {
    res.status(200).send({
      message: "Successfully fetched data",
      posts: documents,
    });
  });
});

router.get("/:id", (req, res) => {
  Post.findById({ _id: req.params.id }).then((post) => {
    console.log(post);
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send("Post not found");
    }
    res.status(200);
  });
});

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((result) => {
    res.status(201).json({ message: "Succesfully added", id: result.id });
  });
});

router.put("/:id", (req, res) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then(
    (result) => {
      console.log("updated Successfully");
      res.status(200).json({ message: "Updated Successfully" });
    },
    (err) => {
      console.log(err);
    }
  );
});

router.delete("/:id", (req, res) => {
  const idd = req.params.id;
  Post.deleteOne({ _id: idd }).then(
    (result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted Sucessfully" });
    },
    (err) => {
      console.log(err);
    }
  );
});

module.exports = router;
