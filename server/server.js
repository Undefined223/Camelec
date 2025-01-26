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




app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

require("dotenv").config();
require('./config/conn')
const { PORT } = process.env;



app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
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



io.on('connection', async (socket) => {
  console.log('New client connected');

  socket.on('joinDeliveryRoom', async ({ orderId, userId }) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        socket.emit('unauthorized', 'User not found');
        return;
      }

      if (user.role === 'admin') {
        socket.join(orderId);
        console.log(`Admin joined room: ${orderId}`);
      } else {
        const order = await Order.findById(orderId);
        if (!order) {
          socket.emit('unauthorized', 'Order not found');
          return;
        }

        if (order.userId.toString() === userId) {
          socket.join(orderId);
          console.log(`User joined room: ${orderId}`);
        } else {
          socket.emit('unauthorized', 'Unauthorized access');
        }
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('unauthorized', 'Internal server error');
    }
  });

  socket.on('startDelivery', (orderId) => {
    // Emit delivery start event to the specific room
    io.to(orderId).emit('deliveryStarted', orderId);
  });

  socket.on('updateLocation', ({ orderId, location }) => {
    // Emit location update event to the specific room
    io.to(orderId).emit('locationUpdated', { orderId, location });
  });

  socket.on('completeDelivery', async (orderId) => {
    try {
      const order = await Order.findByIdAndUpdate(orderId, { orderStatus: 'completed' }, { new: true });
      if (order) {
        io.to(orderId).emit('deliveryCompleted', orderId);
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});





app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}, express.static(path.join(__dirname, 'uploads')));









app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
