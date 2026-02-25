const { verifySocketJWT } = require('../utils/socketUtils');

let ioInstance;

function initSocket(server) {
  const io = require('socket.io')(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });
  ioInstance = io;

  // Auth middleware for all namespaces
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    const user = verifySocketJWT(token);
    if (!user) return next(new Error('Unauthorized'));
    socket.user = user;
    next();
  });

  // Order namespace/room
  io.of(/^\/orders\/\w+$/).on('connection', (socket) => {
    const orderId = socket.nsp.name.split('/').pop();
    socket.join(orderId);
    // Only allow user/rider/admin for this order
    // (Further validation can be added here)
    socket.on('disconnect', () => {});
  });

  // Admin namespace
  io.of('/admin').on('connection', (socket) => {
    if (socket.user.role !== 'admin') return socket.disconnect();
    socket.join('admin');
    socket.on('disconnect', () => {});
  });
}

function emitToOrderRoom(orderId, event, data) {
  if (ioInstance) {
    ioInstance.of(`/orders/${orderId}`).emit(event, data);
  }
}

function emitToAdmin(event, data) {
  if (ioInstance) {
    ioInstance.of('/admin').emit(event, data);
  }
}

module.exports = { initSocket, emitToOrderRoom, emitToAdmin };
