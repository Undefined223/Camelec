// ChatProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/app/components/AxiosInstance';
import {
  connectSocket,
  disconnectSocket,
  joinChat,
  onReceiveMessage,
  getSocket
} from "@/app/utils/socket";
import { Chat, Message, User, ChatContextType } from '../types/ChatTypes';

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [isTyping, setIsTyping] = useState<{ [chatId: string]: boolean }>({});
  const [typingUsers, setTypingUsers] = useState<{ [chatId: string]: Set<string> }>({});

  useEffect(() => {
    connectSocket();
    fetchChats();

    const socket = getSocket();

    socket.on('message received', (newMessage: Message) => {
      setMessages(prev => ({
        ...prev,
        [newMessage.chat]: [...(prev[newMessage.chat] || []), newMessage]
      }));
      updateChatList(newMessage);
    });

    socket.on('typing', ({ chatId, userId }) => {
      setTypingUsers(prev => ({
        ...prev,
        [chatId]: new Set([...(prev[chatId] || []), userId])
      }));
    });

    socket.on('stop typing', ({ chatId, userId }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev[chatId] || []);
        newSet.delete(userId);
        return { ...prev, [chatId]: newSet };
      });
    });

    return () => {
      socket.off('message received');
      socket.off('typing');
      socket.off('stop typing');
      disconnectSocket();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await axiosInstance.get('/api/chat/all');
      setChats(sortChatsByLatest(data));
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const initializeChat = async () => {
    try {
      const response = await axiosInstance.post('/api/chat');
      const newChat = response.data;

      setChats(prev => sortChatsByLatest([...prev, newChat]));

      if (newChat._id) {
        await loadMessages(newChat._id);
        joinChat(newChat._id);
      }

      return newChat;
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data } = await axiosInstance.get(`/api/message/${chatId}`);
      setMessages(prev => ({ ...prev, [chatId]: data }));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content: string, chatId: string) => {
    if (!content.trim() || !chatId) return;

    const socket = getSocket();
    const messageData = {
      content: content.trim(),
      chatId: chatId,
    };

    try {
      const { data } = await axiosInstance.post('/api/message', messageData);
      const newMessages = Array.isArray(data) ? data : [data];

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), ...newMessages]
      }));

      socket.emit('new message', newMessages[0]);
      updateChatList(newMessages[newMessages.length - 1]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateChatList = (newMessage: Message) => {
    setChats(prev => {
      const updatedChats = prev.map(chat =>
        chat._id === newMessage.chat
          ? { ...chat, latestMessage: newMessage }
          : chat
      );
      return sortChatsByLatest(updatedChats);
    });
  };

  const sortChatsByLatest = (chatsToSort: Chat[]) => {
    return [...chatsToSort].sort((a, b) => {
      const aTime = a.latestMessage?.createdAt || a.createdAt;
      const bTime = b.latestMessage?.createdAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  };

  return (
    <ChatContext.Provider value={{
      chats,
      setChats,
      activeChat,
      setActiveChat,
      messages,
      sendMessage,
      initializeChat,
      loadMessages,
      isTyping,
      typingUsers
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
