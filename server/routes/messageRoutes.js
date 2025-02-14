const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/AdminMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;