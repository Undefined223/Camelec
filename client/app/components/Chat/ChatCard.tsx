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

  const { user } = useContext(UserContext);

  useEffect(() => {
    initializeSocket();
    setCurrentUser(user);
    fetchChats();

    return () => {
      disconnectSocket();
    };
  }, []);

  

  const fetchChats = async () => {
    try {
      const results = await axiosInstance.get("/api/chat/all");
      const sortedChats = results.data.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setChats(sortedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data } = await axiosInstance.get(`/api/message/${chatId}`);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Modified sendMessage function in ChatCard
  // Add to useEffect
useEffect(() => {
  const socket = getSocket();

  const handleMessage = (message: Message) => {
    if (message.chat === selectedChat?._id) {
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
      scrollToBottom();
    }
  };

  const handleChatUpdate = (updatedChat: Chat) => {
    setChats(prev => prev.map(c => c._id === updatedChat._id ? updatedChat : c));
    if (selectedChat?._id === updatedChat._id) {
      setSelectedChat(updatedChat);
    }
  };

  socket.on("message received", handleMessage);
  socket.on("chat updated", handleChatUpdate);

  if (selectedChat?._id) {
    socket.emit("join chat room", selectedChat._id);
  }

  return () => {
    socket.off("message received", handleMessage);
    socket.off("chat updated", handleChatUpdate);
  };
}, [selectedChat]);

// Modify sendMessage function
const sendMessage = async () => {
  if (!selectedChat || !newMessage.trim() || !currentUser) return;

  // Declare tempId outside try block
  let tempId: string | null = null;

  try {
    const socket = getSocket();
    tempId = `staff-${Date.now()}`; // Now accessible in catch
    
    // Add temporary message
    setMessages(prev => [...prev, {
      _id: tempId,
      content: newMessage,
      sender: currentUser,
      createdAt: new Date().toISOString(),
      isStaffReply: true
    }]);

    socket.emit("new message", {
      content: newMessage,
      chatId: selectedChat._id,
      tempId,
      isStaffReply: true,
      sender: currentUser
    });

    // Handle chat conversion
    if (selectedChat.isAIChat) {
      const { data } = await axiosInstance.patch(`/api/chat/update/${selectedChat._id}`, {
        isAIChat: false,
        users: [currentUser._id]
      });
      socket.emit("chat updated", data);
    }

    setNewMessage("");
    scrollToBottom();
  } catch (error) {
    // Now tempId is accessible here
    if (tempId) {
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
    console.error("Error sending message:", error);
  }
};

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!selectedChat || !currentUser) return;

    if (typingTimeout) clearTimeout(typingTimeout);

    connectSocket();
    joinChat(selectedChat._id);
    startTyping(selectedChat._id);

    const timeout = setTimeout(() => {
      stopTyping(selectedChat._id);
      setIsTyping(false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const updateChatList = (newMessage: Message) => {
    setChats((prev) => {
      const updatedChats = prev.map((chat) =>
        chat._id === newMessage.chat
          ? { ...chat, latestMessage: newMessage }
          : chat
      );

      return [...updatedChats].sort((a, b) => {
        const aTime = a.latestMessage?.createdAt
          ? new Date(a.latestMessage.createdAt).getTime()
          : new Date(a.createdAt).getTime();
        const bTime = b.latestMessage?.createdAt
          ? new Date(b.latestMessage.createdAt).getTime()
          : new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getChatDisplay = (chat: Chat) => {
    if (chat.isAIChat) return { name: "AI Support", pic: "/images/ai-avatar.png" };
    if (chat.isGroupChat) return { name: chat.chatName, pic: "/images/group-avatar.png" };

    const otherUser = chat.users.find((user) => user._id !== currentUser?._id);
    return {
      name: otherUser?.name || "Unknown User",
      pic: otherUser?.pic || "/images/user/default.png",
    };
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative h-full col-span-12 xl:col-span-4">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
          Recent Chats
        </h4>

        <div className="h-[600px] overflow-y-auto">
          {chats.slice(0, 6).map((chat) => {
            const display = getChatDisplay(chat);
            const unread = chat.latestMessage?.sender?._id !== currentUser?._id ? 1 : 0;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  fetchMessages(chat._id);
                  joinChat(chat._id);
                }}
                className="flex cursor-pointer items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
              >
                <div className="relative h-14 w-14 rounded-full">
                  <Image
                    src={display.pic}
                    alt={display.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                  {unread > 0 && (
                    <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {unread}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <h5 className="font-medium text-black dark:text-white">
                    {display.name}
                  </h5>
                  <p className="text-sm text-gray-500 line-clamp-1 dark:text-gray-400">
                    {chat.latestMessage?.content}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(chat.latestMessage?.createdAt || chat.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedChat && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-gray-500 hover:text-primary dark:text-gray-400"
                >
                  ←
                </button>
                <Image
                  src={getChatDisplay(selectedChat).pic}
                  alt={getChatDisplay(selectedChat).name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h3 className="text-lg font-semibold dark:text-white">
                  {getChatDisplay(selectedChat).name}
                  {isTyping && (
                    <span className="ml-2 text-sm text-gray-500">typing...</span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="text-gray-500 hover:text-primary dark:text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="h-[calc(100vh-160px)] overflow-y-auto p-6">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`mb-4 flex ${message?.sender?._id === currentUser?._id
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${message?.sender?._id === currentUser?._id
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-meta-4"
                      }`}
                  >
                    <p>{message.content}</p>
                    <p className="mt-1 text-xs opacity-75">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 w-full border-t border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary focus:outline-none dark:border-strokedark"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-dark"
                >
                  Send
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