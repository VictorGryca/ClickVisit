const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Render login page
router.get('/', (req, res) => {
  res.render('login/index'); 
});

// Handle login form submission
router.post('/login', loginController.loginUser);

module.exports = router;
