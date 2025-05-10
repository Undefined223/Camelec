"use client";

import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
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
  initializeSocket,
} from "@/app/utils/socket";
import UserContext from "@/app/context/InfoPlusProvider";
import axiosInstance from "../AxiosInstance";

interface User {
  _id: string;
  name: string;
  pic: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  chat: string;
  isStaffReply: boolean;
  createdAt: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  isAIChat: boolean;
  users: User[];
  latestMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

const ChatCard = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showPulse, setShowPulse] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("ChatCard: Initializing socket and fetching chats");
    initializeSocket();
    setCurrentUser(user);
    fetchChats();

    return () => {
      console.log("ChatCard: Disconnecting socket");
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "auto"
      });
    }
  }, []);

  const fetchChats = async () => {
    try {
      console.log("ChatCard: Fetching chats");
      const results = await axiosInstance.get("/api/chat/all");
      const sortedChats = results.data.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setChats(sortedChats);
      console.log("ChatCard: Chats fetched", sortedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      console.log("ChatCard: Fetching messages for chat", chatId);
      const { data } = await axiosInstance.get(`/api/message/${chatId}`);
      setMessages(data);
      scrollToBottom();
      console.log("ChatCard: Messages fetched", data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    console.log("ChatCard: Setting up socket listeners");
    const socket = getSocket();

    const handleMessage = (message: Message) => {
      console.log("ChatCard: Message received", message);

      if (selectedChat && message.chat?._id === selectedChat._id) {
        setMessages((prevMessages) => {
          const exists = prevMessages.some((m) => m._id === message._id);
          console.log("ChatCard: Message exists in state?", exists);
          if (!exists) {
            console.log("ChatCard: Adding new message to state");
            // Show electrical pulse animation when new message arrives
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 1000);
            return [...prevMessages, message];
          }
          return prevMessages;
        });
        scrollToBottom();
      } else {
        console.log("ChatCard: Message chat ID does not match selected chat ID");
      }
    };

    const handleChatUpdate = (updatedChat: Chat) => {
      console.log("ChatCard: Chat updated", updatedChat);
      setChats((prev) =>
        prev.map((c) => (c._id === updatedChat._id ? updatedChat : c))
      );
      if (selectedChat?._id === updatedChat._id) {
        setSelectedChat(updatedChat);
      }
    };

    socket.on("message received", handleMessage);
    socket.on("chat updated", handleChatUpdate);

    return () => {
      console.log("ChatCard: Cleaning up socket listeners");
      socket.off("message received", handleMessage);
      socket.off("chat updated", handleChatUpdate);
    };
  }, [selectedChat]);

  useEffect(() => {
    const socket = getSocket();
    if (selectedChat?._id) {
      console.log("ChatCard: Joining chat room", selectedChat._id);
      socket.emit("join chat room", selectedChat._id);
    }

    return () => {
      if (selectedChat?._id) {
        console.log("ChatCard: Leaving chat room", selectedChat._id);
        socket.emit("leave chat room", selectedChat._id);
      }
    };
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim() || !currentUser) return;

    try {
      console.log("ChatCard: Sending message", newMessage);
      const socket = getSocket();
      socket.emit("new message", {
        content: newMessage,
        chatId: selectedChat._id,
        isStaffReply: true,
        sender: currentUser,
      });

      // Show electrical pulse animation when sending message
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);

      if (selectedChat.isAIChat) {
        const { data } = await axiosInstance.patch(
          `/api/chat/update/${selectedChat._id}`,
          {
            isAIChat: false,
            users: [currentUser._id],
          }
        );
        socket.emit("chat updated", data);
      }

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!selectedChat || !currentUser) return;

    if (typingTimeout) clearTimeout(typingTimeout);

    console.log("ChatCard: Typing started");
    connectSocket();
    joinChat(selectedChat._id);
    startTyping(selectedChat._id);

    const timeout = setTimeout(() => {
      stopTyping(selectedChat._id);
      setIsTyping(false);
      console.log("ChatCard: Typing stopped");
    }, 1000);

    setTypingTimeout(timeout);
  };

  const scrollToBottom = () => {
    console.log("ChatCard: Scrolling to bottom");
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getChatDisplay = (chat: Chat) => {
    if (chat.isAIChat) {
      return {
        name: "AI Assistant",
        icon: (
          <div className="w-full h-full flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-sky-500"
            >
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="electric-bolt" 
              />
            </svg>
          </div>
        )
      };
    }

    return {
      name: chat.users.find(u => u._id !== currentUser?._id)?.name || "User",
      icon: (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center text-white">
          {chat.users.find(u => u._id !== currentUser?._id)?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )
    };
  };
  
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative h-full col-span-12 xl:col-span-4">
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
          100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(14, 165, 233, 0.8)); }
          50% { filter: drop-shadow(0 0 15px rgba(14, 165, 233, 1)); }
        }
        
        @keyframes zap {
          0% { stroke-dashoffset: 100; opacity: 0.8; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        
        .electric-bolt {
          stroke-dasharray: 100;
          animation: zap 1.5s linear infinite alternate;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        .chat-container {
          background: linear-gradient(to bottom right, #ffffff, #f0f9ff);
          border: 1px solid rgba(14, 165, 233, 0.3);
        }
        
        .message-typing {
          position: relative;
        }
        
        .message-typing::after {
          content: '⚡';
          animation: glow 1.5s ease-in-out infinite;
          margin-left: 5px;
        }
        
        .message-received {
          transition: all 0.3s ease;
        }
        
        .send-button {
          position: relative;
          overflow: hidden;
        }
        
        .send-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: rotate(45deg);
          transition: all 0.5s;
        }
        
        .send-button:hover::before {
          left: 100%;
        }
      `}</style>
      
      <div className="rounded-lg border border-sky-200 bg-gradient-to-br from-white to-sky-50  chat-container">
        <div className="mb-6 px-6 py-4 bg-gradient-to-r  rounded-t-lg flex items-center">
          <svg 
            className="w-6 h-6 mr-2 text-sky-800" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="electric-bolt"
            />
          </svg>
          <h4 className="text-xl font-semibold text-sky-800">
            Recent Chats
          </h4>
        </div>

        <div className=" overflow-y-auto" id="chat-container" ref={chatContainerRef}>
          {chats.slice(0, 6).map((chat) => {
            const display = getChatDisplay(chat);
            const unread = chat.latestMessage?.sender?._id !== currentUser?._id ? 1 : 0;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  console.log("ChatCard: Selecting chat", chat._id);
                  setSelectedChat(chat);
                  fetchMessages(chat._id);
                  joinChat(chat._id);
                }}
                className="flex cursor-pointer items-center gap-4 px-6 py-3 hover:bg-sky-100 transition-all duration-300 border-b border-sky-100"
              >
                <div className={`relative h-12 w-12 rounded-full flex items-center justify-center ${unread > 0 ? 'pulse-animation' : ''}`}>
                  <div className="text-sky-600 w-10 h-10 flex items-center justify-center">
                    {display.icon}
                  </div>
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs text-white shadow-lg">
                      {unread}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <h5 className="font-medium text-sky-800">{display.name}</h5>
                  <p className="text-sm text-sky-600 line-clamp-1">
                    {chat.latestMessage?.content || "Start a conversation..."}
                  </p>
                </div>
                <span className="text-xs text-sky-500 bg-sky-50 px-2 py-1 rounded-md">
                  {formatTime(chat.latestMessage?.createdAt || chat.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedChat && (
        <div className="fixed inset-0 z-999999 bg-sky-900/50 backdrop-blur-sm transition-all duration-300">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-white to-sky-50 shadow-2xl transform transition-all duration-500 border-l border-sky-200">
            <div className="flex items-center justify-between border-b border-sky-200 px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    console.log("ChatCard: Deselecting chat");
                    setSelectedChat(null);
                  }}
                  className="text-white hover:text-sky-200 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
               
                <h3 className="text-lg font-semibold text-white flex items-center">
                  {getChatDisplay(selectedChat).name}
                  {isTyping && (
                    <span className="ml-2 text-sm text-white message-typing">typing</span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => {
                  console.log("ChatCard: Closing chat");
                  setSelectedChat(null);
                }}
                className="text-white hover:text-sky-200 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className={`h-[calc(100vh-160px)] overflow-y-auto p-6 ${showPulse ? 'pulse-animation' : ''}`}>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`mb-4 flex ${message.sender?._id === currentUser?._id
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 message-received ${
                      message.sender?._id === currentUser?._id
                        ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                        : "bg-gradient-to-r from-sky-100 to-sky-200 text-sky-800"
                    }`}
                  >
                    {/* Sender's name */}
                    {message.sender && (
                      <div
                        className={`text-xs font-medium mb-1 ${message.sender?._id === currentUser?._id
                          ? "text-sky-100"
                          : "text-sky-600"
                          }`}
                      >
                        {message.sender._id === currentUser?._id
                          ? "You"
                          : message.sender.name}
                      </div>
                    )}
                    {/* Message content */}
                    <p>{message.content}</p>
                    {/* Timestamp */}
                    <p className="mt-1 text-xs opacity-75 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="absolute bottom-0 left-0 w-full border-t border-sky-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-2 text-white hover:from-sky-600 hover:to-sky-700 transition-all send-button"
                >
                  <div className="flex items-center">
                    Send
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatCard;