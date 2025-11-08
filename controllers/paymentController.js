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

  // === Generate 5 digit invoice ===
  const invoiceNumber = Math.floor(10000 + Math.random() * 90000);
  const now = new Date();

  // DD/MM/YYYY
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  // add fields into payment object
  payment.invoiceNumber = invoiceNumber;
  payment.date = formattedDate;
  payment.time = formattedTime;

  // save payment
  const insertResult = await paymentCollection.insertOne(payment);

  // delete carts after payment
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
exports.getPaymentById = async (req, res) => {
  const db = getDB();
  const product = db.collection("payment");
  const result = await product.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};

// update payment
exports.updatePayment = async (req, res) => {
  try {
    const db = getDB();
    const paymentCollection = db.collection("payment");
    const id = req.params.id;
    const updateData = req.body;

    const updateFields = ["processBy", "courier", "status", "note"];

    const filteredData = Object.keys(updateData)
      .filter((key) => updateFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});
    if (filteredData.note) {
      await paymentCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { note: filteredData.note } }
      );
      return res.send({ success: true, message: "Note added" });
    }
    const result = await paymentCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: filteredData }
    );
    res.send({ success: true, updated: filteredData });
  } catch (error) {
    res.status(500).send({ error: "Failed to update payment" });
  }
};
