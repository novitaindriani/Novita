import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // In-memory store for sessions (reset on server restart)
  // In a real app, use a database
  const sessions: Record<string, any> = {};

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', ({ patientId, pharmacistId }) => {
      const roomId = `${patientId}_${pharmacistId}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      
      // Send previous messages if session exists
      if (sessions[roomId]) {
        socket.emit('chat_history', sessions[roomId]);
      } else {
        sessions[roomId] = [];
        socket.emit('chat_history', []);
      }
    });

    socket.on('send_message', ({ roomId, message }) => {
      if (!sessions[roomId]) sessions[roomId] = [];
      sessions[roomId].push(message);
      io.to(roomId).emit('new_message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
