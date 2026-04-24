// server.js

const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Use express.json() middleware
app.use(express.json());

// Define POST /bfhl route
app.post('/bfhl', (req, res) => {
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: "data field is missing" });
  }
  
  res.json({ data });
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});