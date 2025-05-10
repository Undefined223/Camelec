import { io } from "socket.io-client";
import { getToken } from "../components/tokenUtility";



// Initialize Socket.IO client
const socket = io("http://localhost:5000", {
    autoConnect: false, // Prevent automatic connection
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket"], // Use WebSocket only
    query: { token: getToken() },// Pass token securely    
});

// Connect to the server
export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};
export const initializeSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const getSocket = () => socket;

// Disconnect from the server
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Join a chat room
export const joinChat = (chatId) => {
    socket.emit("join chat room", chatId);
};

// Send a message
export const sendMessage = (message) => {
    socket.emit("new message", message);
};

// Notify server that the user is typing
export const startTyping = (chatId) => {
    socket.emit("typing", chatId);
};

// Notify server that the user has stopped typing
export const stopTyping = (chatId) => {
    socket.emit("stopTyping", chatId);
};

// Listen for new messages
export const onReceiveMessage = (callback) => {
    socket.on("message received", callback);
};

// Listen for typing events
export const onTyping = (callback) => {
    socket.on("typing", callback);
};

// Listen for stop typing events
export const onStopTyping = (callback) => {
    socket.on("stopTyping", callback);
};

// Remove message listener
export const offReceiveMessage = () => {
    socket.off("receiveMessage");
};

// Remove typing listeners
export const offTyping = () => {
    socket.off("typing");
};

export const offStopTyping = () => {
    socket.off("stopTyping");
};

export const onNewOrderNotification = (callback) => {
    socket.on("newOrderNotification", callback);
};

// Remove new order notification listener
export const offNewOrderNotification = () => {
    socket.off("newOrderNotification");
};

// Listen for delivery started notifications
export const onDeliveryStarted = (callback) => {
    socket.on("deliveryStarted", callback);
};

// Remove delivery started notification listener
export const offDeliveryStarted = () => {
    socket.off("deliveryStarted");
};

// Listen for new chat notifications
export const onNewChatNotification = (callback) => {
    socket.on("newChatNotification", callback);
};

// Remove new chat notification listener
export const offNewChatNotification = () => {
    socket.off("newChatNotification");
};

export default socket;