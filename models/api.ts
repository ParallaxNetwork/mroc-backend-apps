import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    apiKey: String,
    hashKey: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("apikey", schema)