const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
exports.approveSalary = async (req, res) => {
  try {
    const db = getDB();
    const approveSalary = db.collection("salaryCollection");
    const {
      id_no,
      name,
      number,
      designation,
      salary,
      month,
      houseRent,
      professionalTax,
      overtime,
      commission,
      netPayable,
      remarks = "",
      status = "Paid",
      generateDate,
    } = req.body;

    if (!id_no || !name) {
      return res
        .status(400)
        .send({ message: "Missing required fields: id_no or name" });
    }
    const filter = { id_no };
    const update = {
      $set: {
        name,
        number,
        designation,
        salary,
        month,
        houseRent,
        professionalTax,
        overtime,
        commission,
        netPayable,
        remarks,
        status,
        generateDate: generateDate ? new Date(generateDate) : new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    };
    const options = { upsert: true };
    const result = await approveSalary.updateOne(filter, update, options);
    res.send({
      message: "Salary saved successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};

exports.getSalary = async (req, res) => {
  const db = getDB();
  const salary = db.collection("salaryCollection");
  const result = await salary.find().toArray();
  res.send(result);
};
