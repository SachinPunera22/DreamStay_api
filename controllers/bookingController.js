const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user.model");
const catchAsync = require("./../utils/catchAsync");
var ObjectId = require("mongoose").Types.ObjectId;
const AppError = require("./../utils/appError");
const Package = require("../models/package.model");
const Booking = require("../models/booking.model");
const mongoose = require("mongoose");


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  if (!ObjectId.isValid(req.params.tourID)) {
    return res
      .status(400)
      .send(`Package details is not present ${req.params.tourID}`);
  }

  // 1)Get the currently booked tour
  const tour = await Package.findById(req.params.tourID);
  // 2)Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get(
    //   "host"
    // )}/booking-status/${req.user._id}`,
    success_url: `http://localhost:4200/booking-status/${req.user._id}`,

    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: tour.name,
        description: tour.description,
        amount: tour.price * 100,
        quantity: 1,
        currency: "inr",
      },
    ],
  });

  // 3)Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = async (session) => {
  const package = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const priice = session.amount_total / 100;
  const bookingName= session.name;

  console.log(' ********* bookingName***********:'+  bookingName);
  await Booking.create({ package, user, priice, bookingName });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    return res.status(401).send("Webhook error:"`${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      createBookingCheckout(event.data.object);
      res.status(200).json({ received: true });
    }
  } catch (err) {
    return res.status(402).send("Webhook error:"`${err.message}`);
  }
};

exports.getUserBooking =(req, res, next) => {
  // const bookingId = req.params.userId;

  //find the booking
 
    // const bookingId = (
    //   await Booking.findOne({ user: userId }, {}, { sort: { createdAt: -1 } })
    // ).id;
    
    //  Booking.findById(bookingId, (err, docs) => {
    //   if (!err) {
    //     console.log('hello');
    //     res.status(200).send(docs);
    //   } else {
    //     console.log('no hello');
    //     console.log("Error" + JSON.stringify(err, undefined, 2));
    //   }
    // });

    if (!ObjectId.isValid(req.params.userId)) {
      return res
        .status(400)
        .send(`Users details is not present ${req.params.id}`);
    }
  
    const bookingId = new mongoose.Types.ObjectId(req.params.userId);
    console.log('id:'+ bookingId);
    Booking.findOne({_id:bookingId}, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log("Error" + JSON.stringify(err, undefined, 2));
      }
    });
   
  
};
