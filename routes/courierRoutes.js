const express = require("express");
const {
  createCourier,
  getCourier,
  getCourierById,
  updateCourier,
  deleteCourier,
} = require("../controllers/courierController");

const router = express.Router();

router.post("/", createCourier);
router.get("/", getCourier);
router.get("/:id", getCourierById);
router.put("/:id", updateCourier);
router.delete("/:id", deleteCourier);

module.exports = router;
