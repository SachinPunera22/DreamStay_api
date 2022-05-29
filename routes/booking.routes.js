const express = require("express");

const router = express.Router();

const ctrlBooking = require("../controllers/bookingController");
const authCtrl = require("../controllers/auth.controller");

router.get("/checkout-session/:tourID", authCtrl.protect,ctrlBooking.getCheckoutSession);
router.get("/userBooking/:userId",ctrlBooking.getUserBooking)

module.exports = router;
