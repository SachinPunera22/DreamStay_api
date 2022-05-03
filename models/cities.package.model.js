const mongoose = require("mongoose");
const citiesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
  },
})