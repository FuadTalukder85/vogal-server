const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createProduct = async (req, res) => {
  const db = getDB();
  const product = db.collection("productCollection");
  const result = await product.insertOne(req.body);
  res.send(result);
};

exports.getProducts = async (req, res) => {
  const db = getDB();
  const product = db.collection("productCollection");
  const result = await product.find().toArray();
  res.send(result);
};

exports.getProductById = async (req, res) => {
  const db = getDB();
  const product = db.collection("productCollection");
  const result = await product.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};

exports.updateProduct = async (req, res) => {
  const db = getDB();
  const product = db.collection("productCollection");
  const update = req.body;
  const result = await product.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        title: update.title,
        tag: update.tag,
        firstImg: update.firstImg,
        secondImg: update.secondImg,
        thirdImg: update.thirdImg,
        price: update.price,
        discount: update.discount,
        description: update.description,
      },
    },
    { upsert: true }
  );
  res.send(result);
};

exports.deleteProduct = async (req, res) => {
  const db = getDB();
  const product = db.collection("productCollection");
  const result = await product.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};
