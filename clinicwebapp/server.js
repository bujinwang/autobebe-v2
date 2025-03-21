const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(compression()); // Compress all responses
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// All remaining requests return the React app, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
}); 