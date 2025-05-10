const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const app = express();
const path = require('path');
const ProductRoutes = require('./routes/productRoute')
const CategoryRoutes = require('./routes/categoryRoute')
const SubCategoryRoutes = require('./routes/SubCategoryRoute')
const http = require('http');
const UserRoutes = require('./routes/userRoutes');
const OrderRoutes = require('./routes/OrderRoute');
const VisitorRoutes = require('./routes/visitorRoutes');
const AnnouncmentRoutes = require('./routes/AnnouncmentRoute');
const { upload } = require("./utils/storage");
const { registerUser } = require("./controllers/userController");
const bodyParser = require("body-parser");
const passwordRoutes = require('./routes/passwordRoutes');
const businessRoutes = require('./routes/BusinessRoute');
const User = require("./models/userModel");
const Order = require("./models/OrderSchema");
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes');
const Message = require("./models/messageModel");
const Chat = require("./models/chatModel");
const generateAIResponse = require("./utils/GenerateAiResponse");
const { emitToAdmins } = require("./utils/SocketUtils");
const authenticateSocket = require("./middleware/TokenMiddleware");
const { adminSockets, addAdminSocket, removeAdminSocket } = require("./utils/AdminSockets");


app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




require("dotenv").config();
require('./config/conn')
const { PORT } = process.env;


app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  origin: "*",
  credentials: true,
}));

app.use(express.json());



app.use('/api/products', ProductRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/subCategories', SubCategoryRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/', VisitorRoutes);
app.use('/api/announcments', AnnouncmentRoutes);
app.use('/api/password/', passwordRoutes);
app.use('/api/business/', businessRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



app.get('/webhook', async (req, res) => {
  const paymentRef = req.query.payment_ref;

  if (!paymentRef) {
    return res.status(400).send('Payment reference is required');
  }

  // Log the received payment reference
  console.log(`Received payment reference: ${paymentRef}`);

  try {
    // Fetch payment details using the payment reference
    const response = await axios.get(`https://api.preprod.konnect.network/api/v2/payments/${paymentRef}`, {
      headers: {
        'x-api-key': process.env.API_KEY  // Replace with your actual API key
      }
    });

    const paymentDetails = response.data;
    console.log('Payment details:', paymentDetails);

    // Process the payment details as needed
    // For example, you can update your database or trigger some other action

    res.status(200).send('Webhook received and processed');
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).send('Internal Server Error');
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  connectionStateRecovery: {
    maxDisconnectionDuration: 60000,
    skipMiddlewares: true
  },
  allowEIO3: true, // Add legacy browser support
  cookie: false,
  transports: ['websocket', 'polling'],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

// io.engine.on("connection", (socket) => {
//   let packetsReceived = 0;

  
//   setInterval(() => {
//     if (packetsReceived === 0) {
//       console.log(`No packets received from ${socket.id}, disconnecting`);
//       socket.disconnect(true);
//     }
//     packetsReceived = 0;
//   }, 30000);
// });

// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.query.token;
//     if (!token) throw new Error('No token provided');
    
//     const user = await User.findOne({
//       _id: jwt.verify(token, process.env.JWT_SECRET).id
//     }).select('+socketConnection');
    
//     if (!user) throw new Error('User not found');
    
//     // Prevent multiple connections for same user
//     if (user.socketConnection && user.socketConnection !== socket.id) {
//       console.log(`Closing duplicate connection for ${user._id}`);
//       socket.disconnect(true);
//       return;
//     }
    
//     user.socketConnection = socket.id;
//     await user.save({ validateBeforeSave: false });
    
//     socket.user = user;
//     next();
//   } catch (err) {
//     console.log(`Authentication failed for ${socket.id}: ${err.message}`);
//     next(new Error('Authentication error'));
//   }
// });

const { setIoReference } = require("./utils/SocketUtils");
setIoReference(io);
console.log("[Server] Socket.io initialized and reference set");

// setTimeout(() => {
//   console.log("Manual test: Emitting to admins...");
//   emitToAdmins("testEvent", { msg: "Hello Admins" });
// }, 5000); // Wait 5 seconds after server starts


io.on('connection', async (socket) => {
  
  console.log('New client connected with ID:', socket.id);
  authenticateSocket(socket, (err) => {
    if (err) {
      console.error('Socket authentication error:', err.message);
      socket.disconnect();
      return;
    }

    if (socket.user?.isAdmin) {
      addAdminSocket(socket.id);
    }
  });
  // ========== HEARTBEAT MANAGEMENT ==========
  let lastPing = Date.now();
  
  socket.on('ping', () => lastPing = Date.now());
  setInterval(() => {
  }, 5000);


  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Modify the joinDeliveryRoom handler:
  socket.on('joinDeliveryRoom', async ({ orderId, userId }) => {
    try {
      const user = await User.findById(userId);
      const order = await Order.findById(orderId);

      if (!user || !order) {
        socket.emit('unauthorized', 'Invalid credentials');
        return;
      }

      // Allow: admins, order owner, or assigned delivery person
      const isAuthorized = socket.user.isAdmin || 
        order.userId._id.equals(socket.user._id) ||
        (order.deliveryPerson?._id.equals(socket.user._id));

         if (!isAuthorized) {
        return socket.emit('error', 'Unauthorized access');
      }

      if (isAuthorized) {
        socket.join(orderId);
        console.log(`User ${userId} joined room ${orderId}`);
        // Send initial state
        socket.emit('deliveryStateUpdate', orderId, {
          status: order.orderStatus,
          lastLocation: order.lastLocation
        });
        emitToAdmins('deliveryStarted', {
          orderId: orderId,
          message: `Delivery started for by ${user.name}`,
        });
      } else {
        socket.emit('unauthorized', 'Access denied');
      }
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('unauthorized', 'Server error');
    }
  });

  socket.on('updateLocation', ({ orderId, location }) => {
    console.log('updateLocation received:', {
      socketId: socket.id,
      orderId,
      location,
      rooms: Array.from(socket.rooms)
    });

    socket.emit('locationAck', { received: true, timestamp: new Date().toISOString() });

    io.to(orderId).emit('locationUpdated', { orderId, location });
  });

  socket.on('completeDelivery', async (orderId) => {
    console.log('Complete delivery request:', orderId);
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: 'completed' },
        { new: true }
      );
      if (order) {
        io.to(orderId).emit('deliveryCompleted', orderId);
        console.log(`Delivery completed for order: ${orderId}`);
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
      socket.emit('error', 'Failed to complete delivery');
    }
  });

  socket.on('cancelDelivery', async (orderId) => {
    console.log('Cancel delivery request:', orderId);
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: 'cancelled' },
        { new: true }
      );
      if (order) {
        io.to(orderId).emit('deliveryCancelled', orderId);
        console.log(`Delivery cancelled for order: ${orderId}`);
      }
    } catch (error) {
      console.error('Error cancelling delivery:', error);
      socket.emit('error', 'Failed to cancel delivery');
    }
  });
  socket.on("join chat room", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });
  // Handle new messages
  // Modify the "new message" handler
  socket.on("new message", async (messageData) => {
    try {
      // Create and broadcast user message
      const message = await Message.create({
        content: messageData.content,
        chat: messageData.chatId,
        sender: messageData.sender._id,
        isStaffReply: messageData.isStaffReply,
        tempId: messageData.tempId
      });

      const populatedMessage = await Message.populate(message, [
        { path: "sender", select: "name pic" },
        { path: "chat", populate: { path: "users" } }
      ]);

      const responseData = {
        ...populatedMessage.toObject(),
        tempId: messageData.tempId
      };

      io.to(messageData.chatId).emit("message received", responseData);

      // Handle AI response
      const chat = await Chat.findById(messageData.chatId);
      if (chat.isAIChat && !messageData.isStaffReply) {
        try {
          const aiResponse = await generateAIResponse(messageData.content);
          const aiMessage = await Message.create({
            content: aiResponse,
            chat: messageData.chatId
          });

          const populatedAIMessage = await Message.populate(aiMessage, [
            { path: "chat" }
          ]);

          io.to(messageData.chatId).emit("message received", {
            ...populatedAIMessage.toObject(),
            isStaffReply: false
          });
        } catch (aiError) {
          console.error("AI Response Failed:", aiError);
          io.to(messageData.chatId).emit("ai error", {
            chatId: messageData.chatId,
            tempId: messageData.tempId
          });
        }
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  });

  // In your socket.io connection handler
  socket.on('requestDeliveryState', async (orderId) => {
    try {
      const order = await Order.findById(orderId);
      socket.emit('deliveryStateUpdate', orderId, {
        status: order.orderStatus,
        lastLocation: order.lastLocation
      });
    } catch (error) {
      console.error('State request failed:', error);
    }
  });


  // Typing indicators
  socket.on("typing", (chatId) => {
    socket.broadcast.to(chatId).emit("user typing");
  });

  socket.on("stop typing", (chatId) => {
    socket.broadcast.to(chatId).emit("user stopped typing");
  });


  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
    if (adminSockets.has(socket.id)) {
      removeAdminSocket(socket.id);
      console.log(`Admin socket ${socket.id} removed`);
    }
  });
});


app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}, express.static(path.join(__dirname, 'uploads')));




module.exports = { io, server };

