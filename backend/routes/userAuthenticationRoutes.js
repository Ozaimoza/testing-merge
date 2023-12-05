const express = require('express');
const router = express.Router();
const userAuthenticationController = require('../controllers/userAuthenticationController');
const validationMiddleware = require('../middleware/validationMiddleWare');
const {authenticateToken} = require('../middleware/authMiddleWare');

// Destructure functions from the imported modules
const {
  registerUser,
  loginUser,
  logoutUser,
  updateAddress,
  viewProfile,
} = userAuthenticationController;

const {
  registrationValidationRules,
  loginValidationRules,
  validate,
} = validationMiddleware;


// Endpoint for user registration
router.post('/register',  validate, registerUser);

// Endpoint for user login
router.post('/login', validate, loginUser);

// Endpoint for user logout, requires authentication
router.post('/logout', authenticateToken, logoutUser);

// Update address after login, requires authentication
router.put('/update-address', authenticateToken, updateAddress);

// View profile, requires authentication
router.get('/view-profile', authenticateToken, viewProfile);

module.exports = router;
