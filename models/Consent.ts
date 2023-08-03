import mongoose, { Schema, Document } from 'mongoose'

export interface IAuthSig {
  sig: string
  derivedVia: string
  signedMessage: string
  address: string
}

export interface IConsent extends Document {
  owner: string
  receiver: string
  fileId: string
  isApproved: boolean
  isActive: boolean
  authSig: IAuthSig
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
    authSig: {
      type: Object,
      required: false,
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
