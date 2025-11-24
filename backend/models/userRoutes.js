// backend/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users/sync
router.post("/sync", async (req, res) => {
  try {
    const { firebaseUid, displayName, email, photoURL, provider } = req.body;

    if (!firebaseUid || !email) {
      return res
        .status(400)
        .json({ error: "firebaseUid y email son obligatorios" });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid }, // filtro
      { firebaseUid, displayName, email, photoURL, provider }, // datos a guardar
      { new: true, upsert: true } // crea si no existe
    );

    res.json(user);
  } catch (err) {
    console.error("❌ Error al guardar usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
