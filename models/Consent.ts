import mongoose, { Schema, Document } from 'mongoose'

export interface IConsent extends Document {
  owner: string
  receiver: string
  fileId: string
  isApproved: boolean
  isActive: boolean
}

const schema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
)

delete mongoose.models['consent']
const model = mongoose.model<IConsent>('consent', schema)

export default model
