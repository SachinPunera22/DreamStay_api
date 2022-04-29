const mongoose = require("mongoose");
const packageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  maxGroupSize: {
    type: Number,
  },
  difficulty: {
    type: String,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 40,
  },
  price: {
    type: Number,
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
  },
  packageDate: {
    type: String,
  },
  stateLocation: {
    type: String,
  },
  totalStops: {
    type: Number,
  },
  totalDays: {
    type: Number,
  },
});

module.exports = mongoose.model("Package", packageSchema);
