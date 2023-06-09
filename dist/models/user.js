import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    _id: String,
    nik: String,
    passwordHash: String,
    ethAddress: String,
    tokenId: String,
    isActive: Boolean,
}, { timestamps: true });
export default mongoose.model('user', schema);
//# sourceMappingURL=user.js.map