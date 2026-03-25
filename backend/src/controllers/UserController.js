const User = require('../models/User');

const UserController = {
  // GET /api/users/by-registro/:registro
  async getUserByRegistro(req, res) {
    try {
      const { registro } = req.params;
      if (!registro) {
        return res.status(400).json({ message: 'El registro académico es requerido' });
      }

      const user = await User.findByRegistroAcademico(registro);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error in getUserByRegistro:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // GET /api/users/:id
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // PUT /api/users/:id
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      // req.user viene del middleware de JWT auth
      if (req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({ message: 'No tienes permiso para editar este perfil' });
      }

      const { nombres, apellidos, email } = req.body;

      if (!nombres || !apellidos || !email) {
        return res.status(400).json({ message: 'Todos los campos (nombres, apellidos, email) son obligatorios' });
      }

      // Validar si el email existe y pertenece a otro usuario
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(id, 10)) {
        return res.status(409).json({ message: 'El correo electrónico ya está en uso' });
      }

      const updatedUser = await User.update(id, { nombres, apellidos, email });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

module.exports = UserController;
