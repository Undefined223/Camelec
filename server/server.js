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



app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




require("dotenv").config();
require('./config/conn')
const { PORT } = process.env;


app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
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

const socketServer = http.createServer(app);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on('connection', async (socket) => {
  console.log('New client connected with ID:', socket.id);

  socket.on('ping', () => {
    socket.emit('pong');
    console.log('Heartbeat received from:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('joinDeliveryRoom', async ({ orderId, userId }) => {
    console.log('Join delivery room request:', { orderId, userId });
    try {
      const user = await User.findById(userId);

      if (!user) {
        console.log('User not found:', userId);
        socket.emit('unauthorized', 'User not found');
        return;
      }

      if (user.role === 'admin' || user.isAdmin === true) {
        socket.join(orderId);
        console.log(`Admin joined room: ${orderId}`);
      } else {
        const order = await Order.findById(orderId);
        if (!order) {
          console.log('Order not found:', orderId);
          socket.emit('unauthorized', 'Order not found');
          return;
        }

        if (order.userId.toString() === userId) {
          socket.join(orderId);
          console.log(`User ${userId} joined order room: ${orderId}`);
        } else {
          console.log('Unauthorized room access attempt:', { userId, orderId });
          socket.emit('unauthorized', 'Unauthorized access');
        }
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('unauthorized', 'Internal server error');
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

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Listen for new messages
  socket.on("sendMessage", async (message) => {
    try {
      // Save the message to the database
      const savedMessage = await Message.create(message);

      // Populate sender and chat details
      const populatedMessage = await Message.populate(savedMessage, {
        path: "sender",
        select: "name pic",
      });

      const finalMessage = await Message.populate(populatedMessage, {
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

      // Emit the message to the chat room
      io.to(message.chat).emit("receiveMessage", finalMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  // Listen for typing events
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing", { userId: socket.id });
  });

  // Listen for stop typing events
  socket.on("stopTyping", (chatId) => {
    socket.to(chatId).emit("stopTyping", { userId: socket.id });
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });
});


app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}, express.static(path.join(__dirname, 'uploads')));









