import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { createServer } from "http";
import { setupSocketIO } from "./lib/socket.js";

dotenv.config();

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const server = createServer(app);

// Setup Socket.io
setupSocketIO(server);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Production setup - FIXED for same domain deployment
if (process.env.NODE_ENV === "production") {
  // Correct path: go up two levels from src folder to reach frontend
  const frontendPath = path.resolve(__dirname, "../../frontend/dist");
  console.log("Serving frontend from:", frontendPath);
  
  // Serve static files
  app.use(express.static(frontendPath));
  
  // Catch-all route for SPA - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // For all other routes, serve the React app
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});