const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createEmployee = async (req, res) => {
  const db = getDB();
  const employee = db.collection("employeeCollection");
  const result = await employee.insertOne(req.body);
  res.send(result);
};

exports.getEmployee = async (req, res) => {
  const db = getDB();
  const employee = db.collection("employeeCollection");
  const result = await employee.find().toArray();
  res.send(result);
};

exports.getEmployeeById = async (req, res) => {
  const db = getDB();
  const employee = db.collection("employeeCollection");
  const result = await employee.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};

exports.updateEmployee = async (req, res) => {
  const db = getDB();
  const employee = db.collection("employeeCollection");
  const update = req.body;
  const result = await employee.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        name: update.name,
        number: update.number,
        email: update.email,
        address: update.address,
        emergency_contact: update.emergency_contact,
        salary: update.salary,
        remarks: update.remarks,
        status: update.status,
      },
    },
    { upsert: true }
  );
  res.send(result);
};

exports.deleteEmployee = async (req, res) => {
  const db = getDB();
  const employee = db.collection("employeeCollection");
  const result = await employee.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
};
