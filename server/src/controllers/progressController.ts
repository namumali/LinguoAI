import { type RequestHandler } from 'express'
import ProgressModel from '../models/Progress'
import joi from '../utils/joi'  // assuming your Joi utility wrapper is here

// 📄 GET progress by user ID
export const getProgressByUserId: RequestHandler = async (req, res): Promise<void> => {
  const { userId } = req.params

  try {
    const progress = await ProgressModel.findOne({ userId })

    if (!progress) {
      res.status(404).json({ message: 'Progress not found' })
      return
    }

    res.status(200).json(progress)
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message || error })
    return
  }
}

// 🔄 PUT update (or create) progress for user
export const updateProgress: RequestHandler = async (req, res): Promise<void> => {
  const { userId } = req.params
  const data = req.body

  // ✅ Validation schema using Joi
  const schema = {
    totalLessons: joi.instance.number().min(0).optional(),
    wordsLearned: joi.instance.number().min(0).optional(),
    daysStreak: joi.instance.number().min(0).optional(),
    weeklyProgress: joi.instance.array().items(joi.instance.number().min(0)).optional()
  }

  const validationError = await joi.validate(schema, data)
  if (validationError) {
    res.status(400).json(validationError)
    return
  }

  try {
    const updated = await ProgressModel.findOneAndUpdate(
      { userId },
      { ...data },
      { new: true, upsert: true }
    )

    res.status(200).json(updated)
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating progress', error: error.message || error })
    return
  }
}
