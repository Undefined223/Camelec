const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const { User } = require("../models/userModel");
const Chat = require("../models/chatModel");
const axios = require('axios')
const { OpenAI } = require("openai");

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(400).json({ error: error.message });
    }
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId, isStaffReply } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    // Check if the logged-in user is a member of the group chat
    const isMember = await Chat.exists({
        _id: chatId,
        users: req.user._id,
    });

    if (!isMember) {
        console.error("You are not a member of this group chat.");
        return res.status(403).json({ message: "You are not a member of this group chat." });
    }

    // Create a new message
    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        isStaffReply: isStaffReply || false, // Mark if this is a staff reply
    };

    try {
        // Save the user's message to the database
        let message = await Message.create(newMessage);

        // Populate sender and chat details
        message = await Message.populate(message, {
            path: "sender",
            select: "name pic",
        });

        message = await Message.populate(message, {
            path: "chat",
            populate: {
                path: "users",
                select: "name pic email",
            },
        });

        // Update the chat's latest message
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        // If this is not a staff reply, send the message to OpenRouter for an AI response
        if (!isStaffReply) {
            const openRouterResponse = await axios.post(
                OPENROUTER_API_URL,
                {
                    model: "deepseek/deepseek-r1:free", // Use DeepSeek R1 model
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: content },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const aiReply = openRouterResponse.data.choices[0].message.content;

            // Save the AI reply as a new message
            const aiMessage = {
                sender: null, // No sender for AI messages
                content: aiReply,
                chat: chatId,
                isStaffReply: false,
            };

            const savedAIMessage = await Message.create(aiMessage);

            // Populate and send the AI message
            const populatedAIMessage = await Message.populate(savedAIMessage, {
                path: "chat",
                populate: {
                    path: "users",
                    select: "name pic email",
                },
            });

            // Update the chat's latest message
            await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedAIMessage });

            // Send both the user message and AI reply to the client
            res.json([message, populatedAIMessage]);
        } else {
            // If this is a staff reply, just send the staff message
            res.json(message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = { allMessages, sendMessage };