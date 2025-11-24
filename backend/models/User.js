// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    displayName: String,
    email: { type: String, required: true, index: true },
    photoURL: String,
    provider: String,
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("User", userSchema);
