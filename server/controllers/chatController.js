const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @description     Create or Access a Chat
// @route           POST /api/chat/
// @access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId && !req.user) {
    return res.status(400).json({
      message: "Invalid user data",
    });
  }

  try {
    // Create AI Chat if no userId is provided
    if (!userId) {
      const aiChatData = {
        chatName: "AI Support",
        isGroupChat: false,
        isAIChat: true,
        users: [req.user._id],
      };

      const createdChat = await Chat.create(aiChatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("latestMessage");

      return res.status(200).json(fullChat);
    }

    // Find existing chat between users
    let existingChat = await Chat.find({
      isGroupChat: false,
      isAIChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    existingChat = await User.populate(existingChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (existingChat.length > 0) {
      res.json(existingChat[0]);
    } else {
      // Create new chat if none exists
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password");

      res.status(200).json(fullChat);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @description     Fetch all chats for a user
// @route           GET /api/chat/
// @access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(populatedResults);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @description     Fetch all chats
// @route           GET /api/chat/all
// @access          Protected
const fetchAllChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.find()
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(populatedResults);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @description     Update chat properties
// @route           PATCH /api/chat/:chatId
// @access          Protected/Admin
const updateChat = asyncHandler(async (req, res) => {
  try {
    const { isAIChat, users } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        $set: { isAIChat },
        $addToSet: { users: { $each: users } }, // Add users without duplicates
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("latestMessage");

    if (!updatedChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(updatedChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { accessChat, fetchChats, fetchAllChats, updateChat };
