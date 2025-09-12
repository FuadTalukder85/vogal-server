const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/", getMessage);
router.put("/", updateMessage);
router.delete("/", deleteMessage);

module.exports = router;
