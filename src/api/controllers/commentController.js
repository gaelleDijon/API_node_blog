const commentmodel = require("../models/commentModel");
const postmodel = require("../models/postModel");

exports.getAllcomments = (req, res) => {
  commentmodel.find({}, (err, comment) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(comment);
    }
  });
};

exports.getcomments = (req, res) => {
  commentmodel.find({ post: req.params.id }, (err, comment) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(comment);
    }
  });
};

exports.createcomment = (req, res) => {
  postmodel.findById(req.params.id, (err, post) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      const comment = new commentmodel({ post: req.params.id, ...req.body }); //{post: req.params.id, ...req.body
      comment.save((err, comment) => {
        if (err) {
          res.status(401);
          console.log(err);
          res.json({ message: err });
        } else {
          res.status(201);
          res.json(comment);
        }
      });
    }
  });
};
exports.updatecomments = (req, res) => {
  //update un element qu'on recupere par son id
  commentmodel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    (err, comment) => {
      if (err) {
        res.status(401);
        console.log(err);
        res.json({ message: err });
      } else {
        res.status(200);
        res.json(comment);
      }
    }
  );
};

exports.deletecomments = (req, res) => {
  commentmodel.deleteMany({}, (err, comment) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(comment);
    }
  });
};

exports.getcomment = (req, res) => {
  commentmodel.findById(req.params.id, (err, comment) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(200);
      res.json(comment);
    }
  });
};
