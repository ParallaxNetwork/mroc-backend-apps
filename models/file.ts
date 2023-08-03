import mongoose, { Schema, Document } from 'mongoose'

export interface IFile extends Document {
  cid: string
  url: string
  symmetricKey: string
  owner: string
  isActive: boolean
}

const schema: Schema<IFile> = new Schema(
  {
    cid: {
      type: String,
      required: true,
    },
    // url: {
    //   type: String,
    //   required: true,
    // },
    // symmetricKey: {
    //   type: String,
    //   required: true,
    // },
    owner: {
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

delete mongoose.models['file']
const model = mongoose.model<IFile>('file', schema)

export default model
