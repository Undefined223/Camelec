// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const authenticateSocket = async (socket, next) => {
//     const token = socket.handshake.query.token;
//     console.log('Authenticating socket connection with token:', token);
  
//     if (!token) {
//       console.error('Authentication error: Token missing');
//       return next(new Error('Authentication error: Token missing'));
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('Decoded token:', decoded);
  
//       const user = await User.findById(decoded.id);
//       if (!user) {
//         console.error('Authentication error: User not found');
//         return next(new Error('Authentication error: User not found'));
//       }
  
//       // Set the user on the socket for all users
//       socket.user = user;
  
//       // Log admin status
//       if (user.isAdmin) {
//         console.log('Admin connected:', user.name);
//       } else {
//         console.log('Non-admin user connected:', user.name);
//       }
  
//       next();
//     } catch (error) {
//       console.error('Authentication error: Invalid token', error);
//       next(new Error('Authentication error: Invalid token'));
//     }
//   };
  
// module.exports = authenticateSocket;

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { addAdminSocket } = require('../utils/AdminSockets');

const authenticateSocket = async (socket, next) => {
  try {
    // Get token from auth header instead of query
    const token = socket.handshake.query.token;
    // console.log("aa", token)
    if (!token) return next(new Error('Authentication error: Token missing'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new Error('Authentication error: User not found'));
    
    socket.user = user;
    
    if (user.isAdmin) {
      console.log(`Admin authenticated: ${user.name}`);
      addAdminSocket(socket.id);
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = authenticateSocket;