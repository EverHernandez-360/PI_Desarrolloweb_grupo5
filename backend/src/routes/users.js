const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');

// Todos los endpoints de usuarios requieren autenticación
router.use(auth);

// GET /api/users/by-registro/:registro
router.get('/by-registro/:registro', UserController.getUserByRegistro);

// GET /api/users/:id
router.get('/:id', UserController.getUserById);

// PUT /api/users/:id
router.put('/:id', UserController.updateUser);

module.exports = router;
