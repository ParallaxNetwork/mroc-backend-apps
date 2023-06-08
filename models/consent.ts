import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    ownerId: String,
    receiverId: String,
    fileId: String,
    expiryDate: Number,
    isActive: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("consent", schema);
