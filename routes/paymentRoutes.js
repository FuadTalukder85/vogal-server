const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  addPayment,
  getPayments,
  getPaymentById,
} = require("../controllers/paymentController");

router.post("/create-payment-intent", createPaymentIntent);
router.post("/", addPayment);
router.get("/", getPayments);
router.get("/:id", getPaymentById);

module.exports = router;
