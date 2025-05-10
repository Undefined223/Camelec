const { adminSockets, getAdminSockets } = require("./AdminSockets");

let ioRef = null;

const setIoReference = (io) => {
  ioRef = io;
  // console.log("[SocketUtils] IO reference has been set");
};

const emitToAdmins = (eventName, data) => {
  // console.log(`\n[emitToAdmins] --- START EMITTING '${eventName}' ---`);
  // console.log(`[emitToAdmins] Event data:`, data);

  if (!ioRef) {
    // console.error("[emitToAdmins] ❌ IO reference not set. Cannot emit event.");
    return;
  }

  const currentAdminSockets = getAdminSockets();
  // console.log(`[emitToAdmins] Found ${currentAdminSockets.length} admin sockets:`, currentAdminSockets);

  if (currentAdminSockets.length === 0) {
    // console.warn("[emitToAdmins] ⚠ No admin sockets connected. Skipping event emission.");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  currentAdminSockets.forEach((socketId) => {
    if (!ioRef.sockets.sockets.has(socketId)) {
      // console.warn(`[emitToAdmins] ⚠ Socket ID ${socketId} is not currently connected. Removing from list.`);
      adminSockets.delete(socketId);
      errorCount++;
      return;
    }

    // console.log(`[emitToAdmins] 🔹 Preparing to emit event '${eventName}' to socket: ${socketId}`);

    try {
      ioRef.to(socketId).emit(eventName, data);
      // console.log(`[emitToAdmins] ✅ Successfully emitted event to socket: ${socketId}`);
      successCount++;
    } catch (error) {
      console.error(`[emitToAdmins] ❌ Error emitting event to ${socketId}:`, error);
      adminSockets.delete(socketId);
      errorCount++;
    }
  });

  // console.log(`[emitToAdmins] --- EMISSION COMPLETE ---`);
  // console.log(`[emitToAdmins] 📊 Summary - Success: ${successCount}, Errors: ${errorCount}\n`);
};

const isIoReady = () => {
  const ready = !!ioRef;
  console.log(`[SocketUtils] IO ready status: ${ready}`);
  return ready;
};

module.exports = { emitToAdmins, setIoReference, isIoReady };
