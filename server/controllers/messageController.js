const express = require("express");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const axios = require("axios");
const asyncHandler = require("express-async-handler");
const generateAIResponse = require("../utils/GenerateAiResponse");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Fetch all messages for a chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Send a message and handle AI response if applicable
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const user = req.user;

  console.log("send message contorller trigerred")

  try {
    const chat = await Chat.findById(chatId);

    // Handle staff reply conversion
    if (user.isAdmin && chat.isAIChat) {
      chat.isAIChat = false;
      if (!chat.users.includes(user._id)) {
        chat.users.push(user._id);
      }
      await chat.save();
    }

    // Create message
    const newMessage = await Message.create({
      sender: user._id,
      content,
      chat: chatId,
      isStaffReply: user.isAdmin,
    });

    // Broadcast message
    const populatedMessage = await Message.populate(newMessage, [
      { path: "sender", select: "name" },
      { path: "chat" },
    ]);

    // Only send AI response if still AI chat
    if (chat.isAIChat && !user.isAdmin) {
      const aiResponse = await generateAIResponse(content);
      const aiMessage = await Message.create({
        content: aiResponse,
        chat: chatId,
      });

      // Broadcast both messages
      return res.json([populatedMessage, aiMessage]);
    }

    res.json([populatedMessage]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { allMessages, sendMessage };
