const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Nueva ruta pública para resetear contraseña
router.post('/reset-password', AuthController.resetPassword);

// Rutas protegidas
router.get('/me', authMiddleware, AuthController.getCurrentUser);

module.exports = router;
