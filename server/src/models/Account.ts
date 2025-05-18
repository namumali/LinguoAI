import { type Document, model, Schema } from 'mongoose'
import { type Account } from '../@types'

interface I extends Document, Account {}

const instance = new Schema<I>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    nativeLanguage: {
      type: String,
      required: false,
    },
    learningLanguages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const modelName = 'accounts'

export default model<I>(modelName, instance)
