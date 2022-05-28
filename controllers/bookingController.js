const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user.model");
const catchAsync = require("./../utils/catchAsync");
var ObjectId = require("mongoose").Types.ObjectId;
const AppError = require("./../utils/appError");
const Package = require("../models/package.model");
const Booking = require("../models/booking.model");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  if (!ObjectId.isValid(req.params.tourID)) {
    return res
      .status(400)
      .send(`Package details is not present ${req.params.tourID}`);
  }

  console.log("user email: " + req.user.email);
  // 1)Get the currently booked tour
  const tour = await Package.findById(req.params.tourID);
  // 2)Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
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

const createBookingCheckout = async session => {
  const package = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].amount / 100;

  await Booking.create({ package, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

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

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};
