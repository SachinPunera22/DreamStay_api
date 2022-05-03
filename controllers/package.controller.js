require("../models/package.model");
var ObjectId = require("mongoose").Types.ObjectId;

const mongoose = require("mongoose");

const Package = mongoose.model("Package");
exports.addPackage = (req, res) => {
  console.log(req.body);
  var package = new Package();
  package.name = req.body.name;
  package.difficulty = req.body.difficulty;
  package.maxGroupSize = req.body.maxGroupSize;
  package.ratingsAverage = req.body.ratingsAverage;
  package.ratingsQuantity = req.body.ratingsQuantity;
  package.price = req.body.price;
  package.priceDiscount = req.body.priceDiscount;
  package.summary = req.body.summary;
  package.description = req.body.description;
  package.imageCover = req.body.imageCover;
  package.nextDate = req.body.nextDate;
  package.stateLocation = req.body.stateLocation;
  package.totalStops = req.body.totalStops;
  package.totalDays = req.body.totalDays;

  package.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log("Error" + JSON.stringify(err, undefined, 2));
    }
  });
};
exports.packageList = (req, res) => {
  Package.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("Error" + JSON.stringify(err, undefined, 2));
    }
  });

};
  exports.packageDetail=
  ("/:id",
  (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .send(`Package details is not present ${req.params.id}`);
    }
    Package.findById(req.params.id, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("Error" + JSON.stringify(err, undefined, 2));
      }
    });
  });


