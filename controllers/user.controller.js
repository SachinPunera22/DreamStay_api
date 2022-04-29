require("../models/user.model");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
var ObjectId = require("mongoose").Types.ObjectId;
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");
const User = mongoose.model("User")

exports.userList = (req, res) => {
  User.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("Error" + JSON.stringify(err, undefined, 2));
    }
  });
};
exports.findUser =
  ("/:id",
  (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .send(`Users details is not present ${req.params.id}`);
    }
    User.findById(req.params.id, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("Error" + JSON.stringify(err, undefined, 2));
      }
    });
  });

// user.save((err, doc) => {

//   if (!err) {
//     res.send(doc);
//   } else {
//     console.log("Error" + JSON.stringify(err, undefined, 2));
//   }
// });
