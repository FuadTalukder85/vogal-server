const express = require("express");
const router = express.Router();
const {
  createAttendance,
  getAttendance,
} = require("../controllers/attendanceController");

router.post("/", createAttendance);
router.get("/", getAttendance);

module.exports = router;
