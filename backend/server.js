import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch(err => console.error("Error conectando a MongoDB:", err));
