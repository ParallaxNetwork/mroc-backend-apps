import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
    nik: {
        type: String,
        unique: true,
        required: true,
    },
    passHash: {
        type: String,
        required: true,
    },
    pkpEth: {
        type: String,
        required: true,
    },
    pkpToken: {
        type: String,
        required: true,
    },
    wallet: {
        type: String,
        required: true,
    },
    encWallet: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { timestamps: true });
delete mongoose.models['user'];
const model = mongoose.model('user', schema);
export default model;
//# sourceMappingURL=User.js.map