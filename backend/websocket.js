// backend/websocket.js
import { WebSocketServer } from "ws";
import Message from "./models/Message.js";

let wss;
const clients = new Map(); // ws -> { username, email }

export function setupWebSocket(server) {
  // El path debe coincidir con el que usas en el frontend: ws://localhost:4000/ws
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    console.log("🔗 Cliente conectado");

    // Leemos username y email desde la URL: ?username=...&email=...
    const params = new URLSearchParams(req.url.split("?")[1] || "");
    const username = params.get("username") || "Anónimo";
    const email = params.get("email") || "";

    // Guardamos info del cliente
    clients.set(ws, { username, email });

    // Avisamos a todos que alguien entró
    broadcast({
      type: "user_joined",
      username,
    });

    ws.on("message", async (data) => {
      try {
        const msg = JSON.parse(data);

        if (msg.type === "chat_message") {
          const payload = {
            type: "new_message",
            username,
            text: msg.text,
            createdAt: new Date().toISOString(),
          };

          // Guardar en MongoDB
          await Message.create({
            username,
            email,
            text: msg.text,
          });

          // Enviar a todos los conectados
          broadcast(payload);
        }
      } catch (err) {
        console.error("❌ Error procesando mensaje WS:", err);
      }
    });

    ws.on("close", () => {
      const info = clients.get(ws);
      clients.delete(ws);

      if (info) {
        broadcast({
          type: "user_left",
          username: info.username,
        });
      }

      console.log("🔌 Cliente desconectado");
    });
  });
}

export function broadcast(obj) {
  if (!wss) return;
  const data = JSON.stringify(obj);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}
