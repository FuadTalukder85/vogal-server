const express = require("express");
const router = express.Router();
const { createCart, getCarts, getUserCart, updateCart, deleteCart } = require("../controllers/cartController");

router.post("/", createCart);
router.get("/", getCarts);
router.get("/user", getUserCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

module.exports = router;