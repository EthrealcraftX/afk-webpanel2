require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required. Exiting.');
  process.exit(1);
}

const express = require('express');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./api/routes');
const { initialize } = require('./api/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

// Auth Routes
app.get('/auth/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth', 'login.html'));
});

app.get('/auth/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth', 'signup.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error' 
  });
});

// Initialize and start server
function startServer() {
  try {
    // Initialize database and directories
    initialize();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log(`- GET  /              - Main page`);
      console.log(`- GET  /create        - Create server page`);
      console.log(`- GET  /auth/login    - Login page`);
      console.log(`- GET  /auth/signup   - Signup page`);
      console.log(`- POST /api/auth/login - Login endpoint`);
      console.log(`- POST /api/auth/signup - Signup endpoint`);
      console.log(`- GET  /api/projects  - List user's servers`);
      console.log(`- POST /api/projects  - Create new server`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  
  // Stop all running processes (if needed)
  // ...
  
  process.exit(0);
});

// Start the application
startServer();