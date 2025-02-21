"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import {
  connectSocket,
  disconnectSocket,
  joinChat,
  sendMessage as socketSendMessage,
  onReceiveMessage,
  offReceiveMessage,
  startTyping,
  stopTyping,
  onTyping,
  offTyping,
  onStopTyping,
  offStopTyping,
  getSocket,
} from "@/app/utils/socket";
import axiosInstance from "./AxiosInstance";
import UserContext from "../context/InfoPlusProvider";

interface Message {
  _id: string;
  content: string;
  sender?: {
    _id: string;
    name: string;
    pic: string;
  };
  isStaffReply: boolean;
  createdAt: string;
}

interface Chat {
  _id: string;
  isAIChat: boolean;
  users: string[];
}

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);
console.log(messages)
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !chat) {
      initializeChat();
    }
  };

  // In initializeChat function
  const initializeChat = async () => {
    try {
      const response = await axiosInstance.post("/api/chat");
      setChat(response.data);

      // Connect to Socket.io and join room
      connectSocket();
      joinChat(response.data._id);

      // Setup socket listeners
      onReceiveMessage((newMessage: Message) => {
        // When staff replies, disable AI and update chat
        setChat(prev => prev ? { ...prev, isAIChat: false } : null);
        setMessages(prev => [...prev, newMessage]);
      });

      loadMessages(response.data._id);
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/message/${chatId}`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };


 useEffect(() => {
  if (isOpen && chat) {
    connectSocket();
    joinChat(chat._id);

    // Ensure you're removing listeners before adding new ones
    const socket = getSocket();

    const handleMessage = (message) => {
      // Check if the message belongs to the current chat and avoid duplicates
      if (message.chat === chat?._id) {
        setMessages((prev) => {
          // Check if the message already exists before adding it to the state
          const exists = prev.some(m => m._id === message._id);
          if (exists) {
            return prev; // Don't add the duplicate message
          } else {
            return [...prev, message]; // Add the new message
          }
        });
        scrollToBottom();

        // Only stop AI thinking for AI responses (non-staff replies)
        if (!message.isStaffReply && !message.sender) {
          setIsAIThinking(false);
        }
      }
    };

    const handleAIError = () => {
      setIsAIThinking(false);
    };

    // Clean up previous listeners before adding new ones
    socket.off("message received", handleMessage);
    socket.off("ai error", handleAIError);

    socket.on("message received", handleMessage);
    socket.on("ai error", handleAIError);

    return () => {
      // Clean up listeners when component is unmounted or when dependencies change
      socket.off("message received", handleMessage);
      socket.off("ai error", handleAIError);
      disconnectSocket();
    };
  }
}, [chat, isOpen]);

  
  // Update the message handling useEffect
  // Add to your useEffect
  useEffect(() => {
    console.log("FloatingChatButton: Setting up socket listeners");
    const socket = getSocket();
  
    const handleMessage = (message) => {
      console.log("FloatingChatButton: Message received", message);
      if (message.chat === chat?._id) {
        console.log("FloatingChatButton: Message is for the current chat");
        setMessages((prev) => {
          const exists = prev.some(m => m._id === message._id);
          if (exists) {
            console.log("FloatingChatButton: Message already exists");
          } else {
            console.log("FloatingChatButton: Adding new message");
          }
          const updatedMessages = exists ? prev : [...prev, message];
          console.log("FloatingChatButton: Updated messages", updatedMessages);
          return updatedMessages;
        });
        scrollToBottom();
  
        // Only stop AI thinking for AI responses
        if (!message.isStaffReply && !message.sender) {
          console.log("FloatingChatButton: Stopping AI thinking");
          setIsAIThinking(false);
        }
      }
    };
  
    const handleAIError = () => {
      console.log("FloatingChatButton: AI error occurred");
      setIsAIThinking(false);
    };
  
    // Clean up previous listeners before adding new ones
    socket.off("message received", handleMessage);
    socket.off("ai error", handleAIError);
  
    socket.on("message received", handleMessage);
    socket.on("ai error", handleAIError);
  
    return () => {
      console.log("FloatingChatButton: Cleaning up socket listeners");
      socket.off("message received", handleMessage);
      socket.off("ai error", handleAIError);
    };
  }, [chat]);
  
  
  

// Modify send handler
const handleSend = async () => {
  if (!input.trim() || !chat || isSending) return;

  setIsAIThinking(true);

  try {
    const socket = getSocket();
    socket.emit("new message", {
      content: input.trim(),
      chatId: chat._id,
      isStaffReply: false,
      sender: user
    });

    setInput("");
  } catch (error) {
    setIsAIThinking(false);
    console.error("Error sending message:", error);
  }
};

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 active:scale-95"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IoChatbubbleEllipses className="w-8 h-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl flex flex-col"
            style={{ height: "600px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {chat?.isAIChat ? "AI Support" : "Live Support"}
                {isAIThinking && (
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </h3>
              <button
                className="p-1 hover:bg-blue-600 rounded-full transition-all"
                onClick={toggleChat}
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 p-4 overflow-y-auto"
              ref={chatWindowRef}
              style={{ height: "calc(100% - 120px)" }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-4 ${msg.sender?._id === user?._id ? "text-right" : "text-left"
                        }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg max-w-[80%] ${msg.sender?._id === user?._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <span className="text-xs opacity-75 mt-1 block">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isAIThinking && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        />
                        <span
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                      AI is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  disabled={isSending}
                />
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center
                    ${isSending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                  onClick={handleSend}
                  disabled={isSending}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IoSend className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatButton;