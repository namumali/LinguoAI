import express from 'express'
import {
  generateWordCard,
  generateSpeakingPrompt,
  generateAlphabetCard,
  getVoiceFeedback
} from '../controllers/aiController'

const router = express.Router()

router.post('/word-card', generateWordCard)
router.post('/speaking-prompt', generateSpeakingPrompt)
router.post('/alphabet-card', generateAlphabetCard)
router.post('/voice-feedback', getVoiceFeedback)

export default router
