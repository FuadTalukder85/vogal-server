const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const db = getDB();
  const collection = db.collection("userCollection");

  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const joinedDate = new Date();
  const formattedDate =
    joinedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    " " +
    joinedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  await collection.insertOne({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    date: formattedDate,
  });

  res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const collection = db.collection("userCollection");

  const user = await collection.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.json({ success: true, message: "Login successful", token });
};

exports.makeAdmin = async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;
  const db = getDB();
  const collection = db.collection("userCollection");
  if (!["admin", "user"].includes(role)) {
    return res.status(400).send({ error: "Invalid role" });
  }
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  );
  res.send(result);
};

exports.getUsers = async (req, res) => {
  const db = getDB();
  const collection = db.collection("userCollection");
  const result = await collection.find().toArray();
  res.send(result);
};

exports.deleteUsers = async (req, res) => {
  const db = getDB();
  const users = db.collection("userCollection");
  const result = await users.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};
