import express from 'express'
import {
  getProgressByUserId,
  updateProgress
} from '../controllers/progressController'

const router = express.Router()

// Get a user's progress
router.get('/:userId', getProgressByUserId)

// Update or create a user's progress
router.put('/:userId', updateProgress)

export default router
