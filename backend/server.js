// backend/server.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { setupWebSocket } from "./websocket.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🔥 MongoDB conectado"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// Ruta test
app.get("/", (req, res) => {
  res.send("Backend funcionando ✔");
});

// Servidor HTTP
const server = http.createServer(app);

// WebSocket
setupWebSocket(server);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor backend en http://localhost:${PORT}`);
});
