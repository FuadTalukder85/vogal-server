const express = require("express");
const router = express.Router();
const {
  approveSalary,
  getSalary,
} = require("../controllers/generateSalaryController");

router.post("/", approveSalary);
router.get("/", getSalary);

module.exports = router;
