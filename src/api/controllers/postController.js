const postmodel = require("../models/postModel");
const apijson = require("../providers/testApiProvider");

exports.getPosts = (req, res) => {
  postmodel.find({}, (err, post) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(post);
    }
  });
};

exports.createPost = (req, res) => {
  const post = new postmodel(req.body);
  if (!post.des) {
    let content = apijson.getRandomText();
    content.then((data) => {
      post.des = data.body;
      post.save((err, post) => {
        if (err) {
          res.status(401);
          console.log(err);
          res.json({ message: err });
        } else {
          res.status(201);
          res.json(post);
        }
      });
    });
  } else {
    post.save((err, post) => {
      if (err) {
        res.status(401);
        console.log(err);
        res.json({ message: err });
      } else {
        res.status(201);
        res.json(post);
      }
    });
  }
};
exports.updatePosts = (req, res) => {
  //update un element qu'on recupere par son id
  postmodel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    (err, post) => {
      if (err) {
        res.status(401);
        console.log(err);
        res.json({ message: err });
      } else {
        res.status(200);
        res.json(post);
      }
    }
  );
};

exports.deletePosts = (req, res) => {
  postmodel.deleteMany({}, (err, post) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(post);
    }
  });
};

exports.getPost = (req, res) => {
  postmodel.findById(req.params.id, (err, post) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(post);
    }
  });
};
