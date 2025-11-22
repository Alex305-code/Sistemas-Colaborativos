// server.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Message = require('./models/Message');
const { setupWebSocket, broadcast } = require('./websocket');

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error MongoDB:', err.message));

// ---- RUTAS ----

// Login básico (por ahora sin guardar usuarios reales)
// Recibe { email, password } y devuelve un token y username
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo es obligatorio' });
  }

  // username basado en el correo o temporal
  const baseName = email.split('@')[0] || 'Usuario';
  const random = Math.floor(Math.random() * 1000);
  const username = `${baseName}_${random}`;

  const userPayload = { email, username };

  const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  return res.json({ token, user: userPayload });
});

// Historial de mensajes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo mensajes' });
  }
});

// Servidor WebSocket
setupWebSocket(server);

// Iniciar servidor HTTP + WS
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
