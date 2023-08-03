import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  nik: string
  passHash: string
  pkpEth: string
  pkpToken: string
  wallet: string
  encWallet: string
  isActive: boolean
}

const schema: Schema<IUser> = new Schema(
  {
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
  },
  { timestamps: true }
)

delete mongoose.models['user']
const model = mongoose.model<IUser>('user', schema)

export default model
