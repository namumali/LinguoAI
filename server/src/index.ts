import dotenv from 'dotenv'
dotenv.config()

import app from './utils/app'            // Express app instance
import mongo from './utils/mongo'        // MongoDB connection logic
import { PORT } from './constants/index'
import authRoutes from './routes/auth'   // /auth - Login, Register, Progress
import apiRoutes from './routes/api'     // /api - AI, Progress, Lessons, etc.
import progressRoutes from './routes/progress' // /api/progress - Progress tracking routes

const bootstrap = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongo.connect()

    // Base health endpoints
    app.get('/', (_req, res) => {
      res.status(200).send('Hello, world!')
    })

    app.get('/healthz', (_req, res) => {
      res.status(204).end()
    })

    // Auth Routes (Login, Register, Authenticated Progress)
    app.use('/auth', authRoutes)

    // API Routes (AI generation, public endpoints, etc.)
    app.use('/api', apiRoutes)

    // Progress model for user progress tracking
    app.use('/api/progress', progressRoutes)  
    

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is listening on port: ${PORT}`)
    })
  } catch (err) {
    console.error('❌ Fatal error during server bootstrap:', err)
    process.exit(1)
  }
}

bootstrap()
