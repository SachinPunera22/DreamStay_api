const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.ObjectId,
    ref: "Package",
    required: [true, "Booking must belong toaTour!"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong toaUser!"],
  },
  price: {
    type: Number,
    required: [true, "Booking must haveaprice."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/,function(next){
  this.populate('user').populate({
    path:'Package',
    select:'name'
  });


 });
 
module.exports = mongoose.model("Booking", bookingSchema );
