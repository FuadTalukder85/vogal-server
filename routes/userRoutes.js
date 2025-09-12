const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  makeAdmin,
  getUsers,
  deleteUsers,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/admin/:id", makeAdmin);
router.get("/", getUsers);
router.delete("/:id", deleteUsers);

module.exports = router;
