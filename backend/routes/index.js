const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { startTest, stopTest, getStatus } = require('../controllers/stressTestController');
const authGuard = require('../middleware/authGuard');
const { loginLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Auth Routes
router.post('/auth/register', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validateRequest, register);

router.post('/auth/login', loginLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], validateRequest, login);

router.post('/auth/logout', logout);

// Stress Test Routes (Protected)
router.post('/stress-test/start', authGuard, startTest);
router.post('/stress-test/stop', authGuard, stopTest);
router.get('/stress-test/status', authGuard, getStatus);

module.exports = router;
