const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const { price } = req.body;
  if (!price || price < 0.5) {
    return res.status(400).send({ error: "Price must be >= 0.5 USD" });
  }
  const amount = Math.round(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({ clientSecret: paymentIntent.client_secret });
};

exports.addPayment = async (req, res) => {
  const db = getDB();
  const paymentCollection = db.collection("payment");
  const carts = db.collection("carts");

  const payment = req.body;
  const insertResult = await paymentCollection.insertOne(payment);

  const query = { _id: { $in: payment.cartsId.map((id) => new ObjectId(id)) } };
  const deleteResult = await carts.deleteMany(query);

  res.send({ insertResult, deleteResult });
};

exports.getPayments = async (req, res) => {
  const db = getDB();
  const paymentCollection = db.collection("payment");
  const result = await paymentCollection.find().toArray();
  res.send(result);
};