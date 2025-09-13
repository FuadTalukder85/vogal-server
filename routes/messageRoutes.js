const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessageById,
} = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/", getMessage);
router.get("/:id", getMessageById);
router.put("/:id", updateMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
