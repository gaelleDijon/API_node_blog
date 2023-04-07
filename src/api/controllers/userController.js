const User = require("../models/userModel");
const jsonwebtoken = require("jsonwebtoken");

exports.register = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      res.status(201);
      res.json({ message: `user created : ${user.email} ` });
    }
  });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || user === null) {
      res.status(401);
      console.log(err);
      res.json({ message: err });
    } else {
      if (
        user.email === req.body.email &&
        user.password === req.body.password
      ) {
        let userDate = {
          email: user.email,
          id: user._id,
          role: "admin",
        };
        jsonwebtoken.sign(
          userDate,
          process.env.JWT_TOKEN,
          { expiresIn: "30days" },
          (err, token) => {
            if (err) {
              res.status(401);
              console.log(err);
              res.json({ message: err });
            } else {
              res.status(200);
              res.json({ message: "login success", token: token });
            }
          }
        );
      } else {
        res.status(401);
        res.json({ message: "login failed" });
      }
    }
  });
};
