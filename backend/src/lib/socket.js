import { createServer } from "http";
import { Server } from "socket.io";

// Store connected users
const userSocketMap = {}; // {userId: socketId}

let io; // Global io instance

export function setupSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket ${socket.id}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        console.log(`User ${userId} disconnected`);
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  // Set the io instance for the message controller
  import("../controllers/message.controller.js")
    .then((module) => {
      module.setIOInstance(io);
    })
    .catch((error) => {
      console.error("Error setting IO instance:", error);
    });

  return io;
}

export const getRecieverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Export io instance
export { io };