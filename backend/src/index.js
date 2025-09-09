import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";

dotenv.config();

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production setup
if (process.env.NODE_ENV === "production") {
    // Serve frontend static files
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Catch-all route for React SPA
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("Server is listening on PORT: " + PORT);
    connectDB();
});
