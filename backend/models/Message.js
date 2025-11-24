// backend/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String },
    text: { type: String, required: true },
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Message", messageSchema);
