import { type Document, model, Schema, Types } from 'mongoose'
import { type Progress } from '../@types'

interface I extends Document, Progress {}

const instance = new Schema<I>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    totalLessons: { type: Number, default: 0 },
    wordsLearned: { type: Number, default: 0 },
    daysStreak: { type: Number, default: 0 },
    weeklyProgress: { type: [Number], default: [] },
  },
  { timestamps: true }
)

export default model<I>('Progress', instance)
