export interface User {
    _id: string;
    name: string;
    pic: string;
  }
  
export  interface Message {
    _id: string;
    content: string;
    sender?: User;
    chat: string;
    isStaffReply: boolean;
    createdAt: string;
  }
  
export  interface Chat {
    _id: string;
    chatName?: string;
    isGroupChat: boolean;
    isAIChat: boolean;
    users: User[];
    latestMessage?: Message;
    createdAt: string;
    updatedAt: string;
  }
  
export  interface ChatContextType {
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    activeChat: Chat | null;
    setActiveChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    messages: { [chatId: string]: Message[] };
    sendMessage: (content: string, chatId: string) => Promise<void>;
    initializeChat: () => Promise<Chat>;
    loadMessages: (chatId: string) => Promise<void>;
    isTyping: { [chatId: string]: boolean };
    typingUsers: { [chatId: string]: Set<string> };
  }
  