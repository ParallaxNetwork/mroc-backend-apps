import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    _id: String,
    owner: String,
    receiver: String,
    fileId: String,
    status: String,
    isActive: Boolean,
  },
  { timestamps: true }
)

export default mongoose.model('consent', schema)
