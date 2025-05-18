import { type RequestHandler } from 'express'

const AI_API_URL = process.env.AI_API_URL || 'http://localhost:11434/api/generate'
const AI_MODEL = process.env.AI_MODEL || 'gemma2:2b'

const generateFromAI = async (prompt: string, res: any): Promise<void> => {
  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: AI_MODEL, prompt }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    if (!response.body) throw new Error('Empty response body')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    const read = (): void => {
      reader.read().then(({ done, value }) => {
        if (done) {
          res.write('data: [DONE]\n\n')
          res.end()
          return
        }
        const chunkStr = decoder.decode(value, { stream: true })
        res.write(`data: ${chunkStr}\n\n`)
        read()
      }).catch(error => {
        console.error('Stream read error:', error)
        res.status(500).json({ error: 'Stream read failed' })
      })
    }

    read()
  } catch (error) {
    console.error('AI Error:', error)
    res.status(500).json({ error: 'AI generation failed' })
  }
}

// 🧠 Word Flashcard Generator
export const generateWordCard: RequestHandler = async (req, res): Promise<void> => {
  const { word, language } = req.body
  if (!word || !language) {
    res.status(400).json({ error: 'Missing word or language' })
    return
  }

  const prompt = `
    Create a flashcard in JSON format for the word "${word}" in ${language}:
    {
      "word": "${word}",
      "translation": "...",
      "pronunciation": "...",
      "example": "...",
      "exampleTranslation": "...",
      "audioUrl": "https://...",
      "imageUrl": "https://..."
    }
    Make it helpful for English learners.
  `
  await generateFromAI(prompt, res)
}

// 🗣️ Speaking Prompt Generator
export const generateSpeakingPrompt: RequestHandler = async (req, res): Promise<void> => {
  const { difficulty, topic } = req.body
  if (!difficulty || !topic) {
    res.status(400).json({ error: 'Missing difficulty or topic' })
    return
  }

  const prompt = `
    Create a speaking practice sentence for a ${difficulty} learner on "${topic}".
    Return JSON:
    {
      "text": "...",
      "translation": "...",
      "difficulty": "${difficulty}",
      "category": "${topic}"
    }
  `
  await generateFromAI(prompt, res)
}

// 🔤 Alphabet Flashcard Generator
export const generateAlphabetCard: RequestHandler = async (req, res): Promise<void> => {
  const { letter } = req.body
  if (!letter) {
    res.status(400).json({ error: 'Missing letter' })
    return
  }

  const prompt = `
    Generate a flashcard for the Russian letter "${letter}" including:
    {
      "letter": "${letter}",
      "latinized": "...",
      "example": "...",
      "exampleTranslation": "...",
      "pronunciation": "...",
      "audioUrl": "https://..."
    }
  `
  await generateFromAI(prompt, res)
}

// 📈 Voice Feedback Generator
export const getVoiceFeedback: RequestHandler = async (req, res): Promise<void> => {
  const { text, audioAccuracy } = req.body
  if (!text || audioAccuracy == null) {
    res.status(400).json({ error: 'Missing input' })
    return
  }

  const prompt = `
    A learner pronounced "${text}" with ${audioAccuracy}% accuracy.
    Provide motivational feedback based on accuracy. Return JSON:
    {
      "accuracy": ${audioAccuracy},
      "feedback": "..."
    }
  `
  await generateFromAI(prompt, res)
}
