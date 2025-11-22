// websocket.js
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

let wss;
const clients = new Map(); // ws -> { username, email }

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('🔗 Nueva conexión WebSocket');

    // Leer token desde query: ws://localhost:4000/ws?token=...
    const params = new URLSearchParams(req.url.split('?')[1]);
    const token = params.get('token');

    if (!token) {
      ws.close();
      return;
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      ws.close();
      return;
    }

    clients.set(ws, { username: user.username, email: user.email });

    // Notificar a todos que un usuario se unió
    broadcast({
      type: 'user_joined',
      username: user.username,
      message: `${user.username} se ha unido al chat`,
    });

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data);

        if (msg.type === 'chat_message') {
          const payload = {
            type: 'new_message',
            username: user.username,
            text: msg.text,
            createdAt: new Date().toISOString(),
          };

          // Guardar en MongoDB
          await Message.create({
            username: user.username,
            text: msg.text,
          });

          broadcast(payload);
        }
      } catch (err) {
        console.error('Error al procesar mensaje WS:', err.message);
      }
    });

    ws.on('close', () => {
      const userInfo = clients.get(ws);
      clients.delete(ws);

      if (userInfo) {
        broadcast({
          type: 'user_left',
          username: userInfo.username,
          message: `${userInfo.username} salió del chat`,
        });
      }
      console.log('🔌 Cliente desconectado');
    });
  });
}

// Enviar mensaje a todos los clientes conectados
function broadcast(obj) {
  if (!wss) return;

  const data = JSON.stringify(obj);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

module.exports = { setupWebSocket, broadcast };
