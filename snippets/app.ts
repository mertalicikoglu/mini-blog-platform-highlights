// snippets/app.ts

import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Enable JSON parsing for request bodies

// Routes setup
app.use('/api/posts', postRoutes); // Post routes
app.use('/api/posts/:postId/comments', commentRoutes); // Comment routes

// Global error handling middleware
app.use(errorHandler);

export default app;
