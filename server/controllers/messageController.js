const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

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

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    const user = req.user;

    if (!content || !chatId) {
        return res.status(400).json({ error: "Invalid data passed into request" });
    }

    try {
        // Get chat and verify permissions
        const chat = await Chat.findById(chatId)
            .populate("users", "-password");

        if (!chat.users.some(u => u._id.equals(user._id))) {
            return res.status(403).json({ error: "Not authorized for this chat" });
        }

        // Check if staff is replying
        const isStaffReply = user.role === "staff";

        // If staff replies, disable AI and add them to chat
        if (isStaffReply) {
            if (!chat.users.some(u => u._id.equals(user._id))) {
                chat.users.push(user._id);
            }
            if (chat.isAIChat) {
                chat.isAIChat = false;
                await chat.save();
            }
        }

        // Create and save message
        const newMessage = await Message.create({
            sender: user._id,
            content,
            chat: chatId,
            isStaffReply,
        });

        // Populate message data
        const populatedMessage = await Message.populate(newMessage, [
            { path: "sender", select: "name pic" },
            { path: "chat", populate: { path: "users", select: "name pic email" } }
        ]);

        // Update chat's latest message
        chat.latestMessage = populatedMessage._id;
        await chat.save();

        // Generate AI response if needed
        if (chat.isAIChat && !isStaffReply) {
            const aiResponse = await generateAIResponse(content);
            
            const aiMessage = await Message.create({
                content: aiResponse,
                chat: chatId,
            });

            const populatedAIMessage = await Message.populate(aiMessage, [
                { path: "chat", populate: { path: "users", select: "name pic email" } }
            ]);

            chat.latestMessage = aiMessage._id;
            await chat.save();

            return res.json([populatedMessage, populatedAIMessage]);
        }

        res.json([populatedMessage]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

async function generateAIResponse(prompt) {
    try {
        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: "deepseek/deepseek-r1:free",
                messages: [
                    { role: "system", content: "You are a helpful customer support assistant." },
                    { role: "user", content: prompt },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("AI Response Error:", error);
        return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
}

module.exports = { allMessages, sendMessage };