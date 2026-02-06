import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chalk from 'chalk';
import { connectDatabase } from './config/database.js';
import { environment } from './config/environment.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocketHandlers } from './socket/socketHandler.js';
import routes from './routes/index.js';
import './model/index.js'; // Import models to establish associations

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: true, // Allow any origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup socket handlers
setupSocketHandlers(io);

// Make io accessible in controllers
app.set('io', io);

// Middleware
app.use(cors({
  origin: true, // Allow any origin
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    const PORT = environment.PORT;
    httpServer.listen(PORT, () => {
      console.log(chalk.green(`\n✓ Server running on port ${PORT}`));
      console.log(chalk.cyan(`✓ API: http://localhost:${PORT}/api`));
      console.log(chalk.cyan(`✓ WebSocket: ws://localhost:${PORT}\n`));
    });
  } catch (error) {
    console.error(chalk.red('Failed to start server:'), error);
    process.exit(1);
  }
};

startServer();

export { io };
