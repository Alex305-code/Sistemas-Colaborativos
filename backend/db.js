// db.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI no está definida en .env. El servidor correrá sin base de datos.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas conectado correctamente');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
  }
}

module.exports = connectDB;
