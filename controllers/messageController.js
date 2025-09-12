const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createMessage = async (req, res) => {
  const db = getDB();
  const message = db.collection("msgCollection");
  const result = await message.insertOne(req, body);
  res.send(result);
};

exports.getMessage = async (req, res) => {
  const db = getDB();
  const message = db.collection("msgCollection");
  const result = await message.findOne({ _id: new ObjectId(req.params.id) });
  res.send({ message: "kire hala", result });
};

exports.updateMessage = async (req, res) => {
  const db = getDB();
  const message = db.collection("msgCollection");
  const update = req.body;
  const result = await message.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        name: update.name,
        email: update.email,
        number: update.number,
        subject: update.subject,
        message: update.message,
      },
    },
    { upsert: true }
  );
  res.send(result);
};

exports.deleteMessage = async (req, res) => {
  const db = getDB();
  const message = db.collection("msgCollection");
  const result = await message.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};
