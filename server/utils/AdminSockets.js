// utils/AdminSockets.js
const adminSockets = new Set();

const addAdminSocket = (socketId) => {
  adminSockets.add(socketId);
  // console.log(`[AdminSockets] Added admin socket: ${socketId}`);
  // console.log(`[AdminSockets] Current admin sockets (${adminSockets.size}):`, Array.from(adminSockets));
};

const removeAdminSocket = (socketId) => {
  const success = adminSockets.delete(socketId);
  // console.log(`[AdminSockets] Removed admin socket: ${socketId}, Success: ${success}`);
  // console.log(`[AdminSockets] Current admin sockets (${adminSockets.size}):`, Array.from(adminSockets));
};

const getAdminSockets = () => {
  const sockets = Array.from(adminSockets);
  // console.log(`[AdminSockets] Getting admin sockets (${sockets.length}):`, sockets);
  return sockets;
};

module.exports = {
  adminSockets,
  addAdminSocket,
  removeAdminSocket,
  getAdminSockets
};