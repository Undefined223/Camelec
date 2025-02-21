const express = require('express');
const { protect } = require('../middleware/AdminMiddleware');
const { accessChat, fetchChats, fetchAllChats, updateChat } = require('../controllers/chatController');

const router = express.Router();

// Route to create or access a chat
router.route('/').post(protect, accessChat);

// Route to fetch all chats for a user
router.route('/').get(protect, fetchChats);
router.route('/all').get(protect, fetchAllChats);
router.route('/update/:chatId').patch(protect, updateChat);



module.exports = router;