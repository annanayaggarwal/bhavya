require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDBs } = require('./utils/db');

const app = express();

// Essential middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server startup function
const startServer = async () => {
  try {
    // Connect to database
    await connectDBs();
    console.log('Database connected');

    // Routes go here
    // app.use('/api/route', routeHandler);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Not Found' });
    });

    // Start server
    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      server.close(() => console.log('Server shutdown complete'));
    });

  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();