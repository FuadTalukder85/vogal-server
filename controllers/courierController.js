const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createCourier = async (req, res) => {
  const db = getDB();
  const courier = db.collection("courierCollection");
  const result = await courier.insertOne(req.body);
  res.send(result);
};

exports.getCourier = async (req, res) => {
  const db = getDB();
  const courier = db.collection("courierCollection");
  const result = await courier.find().toArray();
  res.send(result);
};

exports.getCourierById = async (req, res) => {
  const db = getDB();
  const courier = db.collection("courierCollection");
  const result = await courier.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};

exports.updateCourier = async (req, res) => {
  const db = getDB();
  const courier = db.collection("courierCollection");
  const update = req.body;
  const result = await courier.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        name: update.name,
        totalDelivery: update.totalDelivery,
        totalReturn: update.totalReturn,
        status: update.status,
        image: update.image,
      },
    },
    { upsert: true }
  );
  res.send(result);
};

exports.deleteCourier = async (req, res) => {
  const db = getDB();
  const courier = db.collection("courierCollection");
  const result = await courier.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};
