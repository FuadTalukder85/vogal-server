const { getDB } = require("../config/db");

exports.createAttendance = async (req, res) => {
  try {
    const db = getDB();
    const attendance = db.collection("attendanceCollection");
    const { id_no, date, name, number, present, absent, salary, designation } =
      req.body;

    if (!date || !name || !number) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const existing = await attendance.findOne({ date, number });
    if (existing) {
      const result = await attendance.updateOne(
        { _id: existing._id },
        {
          $set: {
            present: !!present,
            absent: !!absent,
          },
        }
      );
      return res.send({ message: "Attendance updated", result });
    } else {
      const result = await attendance.insertOne({
        id_no,
        date,
        name,
        number,
        salary,
        designation,
        present: !!present,
        absent: !!absent,
        status: "Pending",
      });
      return res.send({ message: "Attendance created", result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error", error });
  }
};
exports.getAttendance = async (req, res) => {
  const db = getDB();
  const attendance = db.collection("attendanceCollection");
  const result = await attendance.find().toArray();
  res.send(result);
};
