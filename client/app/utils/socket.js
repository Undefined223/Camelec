import { io } from "socket.io-client";

// Initialize Socket.IO client
const socket = io("http://localhost:5000", {
    autoConnect: false, // Prevent automatic connection
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket"], // Use WebSocket only
});

// Connect to the server
export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

// Disconnect from the server
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Join a chat room
export const joinChat = (chatId) => {
    socket.emit("joinChat", chatId);
};

// Send a message
export const sendMessage = (message) => {
    socket.emit("sendMessage", message);
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
    socket.on("receiveMessage", callback);
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

export default socket;