import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    fileId: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { timestamps: true });
delete mongoose.models['consent'];
const model = mongoose.model('consent', schema);
export default model;
//# sourceMappingURL=Consent.js.map