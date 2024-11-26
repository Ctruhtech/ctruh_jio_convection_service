import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import stallRoutes from './routes/stallRoutes';

dotenv.config();

// Create an Express app
const app = express();

// Connect to MongoDB
connectDB().then(() => {
  // Start the server after successful DB connection
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  // Handle MongoDB connection failure
  console.error('Faileed to connect to MongoDB:', error);
  process.exit(1); // Exit the process if DB connection fails
});

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON payloads

// Routes
app.use('/api', stallRoutes);

