const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  addPayment,
  getPayments,
} = require("../controllers/paymentController");

router.post("/create-payment-intent", createPaymentIntent);
router.post("/", addPayment);
router.get("/", getPayments);

module.exports = router;
