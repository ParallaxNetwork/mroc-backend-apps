import mongoose from "mongoose";
const schema = new mongoose.Schema({
    _id: String,
    ownerId: String,
    receiverId: String,
    fileId: String,
    isActive: Boolean,
}, { timestamps: true });
export default mongoose.model("consent", schema);
//# sourceMappingURL=consent.js.map