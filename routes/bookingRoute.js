const express = require("express");

const router = express.Router();

const ctrlBookings = require("../controllers/bookingController");
const authCtrl = require("../controllers/auth.controller");

router.get("/checkout-session/:tourID", authCtrl.protect,ctrlBookings.getCheckoutSession);


module.exports = router;
