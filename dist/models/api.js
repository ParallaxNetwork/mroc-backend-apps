import mongoose from "mongoose";
const schema = new mongoose.Schema({
    _id: String,
    apiKey: String,
    hashKey: String,
    isActive: String,
}, { timestamps: true });
export default mongoose.model("apikey", schema);
//# sourceMappingURL=api.js.map