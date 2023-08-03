import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
    cid: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { timestamps: true });
delete mongoose.models['file'];
const model = mongoose.model('file', schema);
export default model;
//# sourceMappingURL=File.js.map