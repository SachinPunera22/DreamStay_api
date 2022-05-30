const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  
  package: {
    type: mongoose.Schema.ObjectId,
    ref: "Package",
    required: [true, "Booking must belong to a Tour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a User!"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bookingName:{
    type: String,
    required: [true, "Booking must have a booking Name."],
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// bookingSchema.pre(/^find/,function(next){
//   this.populate('user').populate({
//     path:'Package',
//     select:'name'
//   });


//  });
 
module.exports = mongoose.model("Booking", bookingSchema );
