// routes/bfhlRoutes.js

const express = require('express');
const { handleBfhl } = require('../controllers/bfhlController');

const router = express.Router();

router.post('/bfhl', handleBfhl);

module.exports = router;