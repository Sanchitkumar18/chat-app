import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: true, // allow all origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  // Add your socket event handlers here
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
  origin: true, // allow requests from any origin
  credentials: true
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production setup: Serve React SPA
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
