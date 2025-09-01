const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createCart = async (req, res) => {
  const db = getDB();
  const carts = db.collection("carts");
  const result = await carts.insertOne(req.body);
  res.send(result);
};

exports.getCarts = async (req, res) => {
  const db = getDB();
  const carts = db.collection("carts");
  const result = await carts.find().toArray();
  res.send(result);
};

exports.getUserCart = async (req, res) => {
  const email = req.query.email;
  const db = getDB();
  const carts = db.collection("carts");
  const result = await carts.find({ email }).toArray();
  res.send(result);
};

exports.updateCart = async (req, res) => {
  const db = getDB();
  const carts = db.collection("carts");
  const { quantity, totalPrice, totalProfit } = req.body;
  const result = await carts.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { quantity, totalPrice, totalProfit } },
    { upsert: true }
  );
  res.send(result);
};

exports.deleteCart = async (req, res) => {
  const db = getDB();
  const carts = db.collection("carts");
  const result = await carts.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};