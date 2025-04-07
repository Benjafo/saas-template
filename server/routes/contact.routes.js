const express = require('express');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

// Public route for contact form submissions
router.post('/', contactController.sendContactMessage);

module.exports = router;
