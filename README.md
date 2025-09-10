# 💬 Chat App

A real-time chat application built with **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.IO** for instant messaging.

Live App: [https://chat-app-gf8z.onrender.com](https://chat-app-gf8z.onrender.com)

---

## 🚀 Features

* 🔐 User Authentication (Signup, Login, Logout)
* 👤 Profile Management
* 💬 Real-time messaging with Socket.IO
* 🟢 Online users indicator
* 🎨 Responsive UI with React + Zustand

---

## 📁 Folder structure (overview)

```
chat-app/
├─ backend/            # Express + MongoDB + Socket.IO server
├─ frontend/           # React app (Vite) + Zustand
└─ README.md           # This file
```

---


### Prerequisites

* Node.js v16+ (recommended)
* npm (or yarn)
* A MongoDB connection URI (Atlas or local)

---

## 🔧 Quick Local Setup (Step-by-step)

### Step 1 — Clone repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

---

### Step 2 — Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with these variables:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5001
```

Start the backend server:

```bash
npm start
```

> Typical `package.json` scripts for backend (example):

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

---

### Step 3 — Frontend

```bash
cd ../frontend
npm install
```

Run the frontend development server:

```bash
npm run dev
```

> Typical `package.json` scripts for frontend (Vite):

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Open the app in your browser (default Vite port):

```
http://localhost:5173
```

---

### Step 4 — Verify Socket.IO is connected

* Open the browser console and the backend terminal.
* When users connect, backend logs should show socket connections.
* Frontend should show online users indicator when someone is connected.

---

## 🧩 Environment & Deployment

### Example `.env` values (backend)

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xyz.mongodb.net/chat_app?retryWrites=true&w=majority
JWT_SECRET=very_secret_string
NODE_ENV=production
PORT=5001
```

### Deploying to Render (quick notes)

1. Create a new Web Service on Render and connect your GitHub repo for the `backend` folder.
2. Set the build and start commands: `npm install` and `npm start`.
3. Add your environment variables in Render's dashboard (MONGO\_URI, JWT\_SECRET, PORT).
4. For `frontend`, you can deploy as a Static Site (build command `npm run build`, publish directory `dist`).
5. Update frontend to point to the deployed backend URL for socket and REST API calls.

---

## 🔁 Common gotchas & troubleshooting

* `ERR_MODULE_NOT_FOUND` for imports: check relative paths and extensions — when using ES modules, ensure `type": "module"` in `package.json` or use CommonJS `require`.
* Socket cannot connect: ensure frontend is trying to connect to the correct backend URL (including correct http/https and port). When deployed, use the Render/Vercel URL.
* CORS errors: allow your frontend origin in backend (use `cors()` middleware and/or set `origin` explicitly).
* JWT auth failing: ensure your `JWT_SECRET` matches between running instances and that the token is being sent in the `Authorization` header as `Bearer <token>`.

---

## ✅ Example quick-check commands

From `chat-app` root, start backend and frontend in separate terminals:

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

---

## 📌 Useful reference snippets

### Backend: Basic Express + Socket.IO snippet (example)

```js
// src/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', socket => {
  console.log('socket connected:', socket.id);
  socket.on('disconnect', () => console.log('disconnected', socket.id));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
```

### Frontend: Basic socket client example (React)

```jsx
// src/socket.js
import { io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
export const socket = io(SOCKET_URL);

// usage in a component
import React, { useEffect } from 'react';
import { socket } from './socket';

export default function App() {
  useEffect(() => {
    socket.on('connect', () => console.log('connected:', socket.id));
    return () => socket.off('connect');
  }, []);
  return <div>Chat App</div>;
}
```

---

