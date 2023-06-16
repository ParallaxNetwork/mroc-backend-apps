import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    _id: String,
    cid: String,
    url: String,
    symmetricKey: String,
    owner: String,
    isActive: Boolean,
}, { timestamps: true });
export default mongoose.model('file', schema);
//# sourceMappingURL=file.js.map