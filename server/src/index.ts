import dotenv from 'dotenv';
import http from 'http';
import getPort from 'get-port';
import express from 'express';
import mongo from './utils/mongo';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import progressRoutes from './routes/progress';
import cors from 'cors';
import userRoutes from './routes/user';



dotenv.config();

const app = express();

app.use(cors({
  origin: '*',  // Allow all origins (for dev); tighten this in production!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Add body parsers to handle incoming JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bootstrap = async (): Promise<void> => {
  try {
    await mongo.connect();

    app.use('/auth', authRoutes);
    app.use('/api', apiRoutes);
    app.use('/api/progress', progressRoutes);
    app.use('/user', userRoutes);

    const desiredPort = process.env.PORT ? Number(process.env.PORT) : 8080;
    const availablePort = await getPort({ port: [desiredPort, desiredPort + 100] });

    http.createServer(app).listen(availablePort, '0.0.0.0', () => {
      console.log(`✅ HTTP server running at http://10.0.0.60:${availablePort}`);
    });

  } catch (err) {
    console.error('❌ Fatal error during server bootstrap:', err);
    process.exit(1);
  }
};

bootstrap();
