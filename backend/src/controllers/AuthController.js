const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const UserModel = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const { registro_academico, nombres, apellidos, email, password } = req.body;

      if (!registro_academico || !nombres || !apellidos || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        registro_academico,
        nombres,
        apellidos,
        email,
        password_hash: hashedPassword
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          nombres: user.nombres
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      const token = generateToken(user.id);

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          email: user.email,
          nombres: user.nombres,
          apellidos: user.apellidos
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el login' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const user = await UserModel.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario actual' });
    }
  }

  //  Nuevo método para resetear contraseña
  static async resetPassword(req, res) {
    try {
      const { registro_academico, email, nuevaPassword } = req.body;

      if (!registro_academico || !email || !nuevaPassword) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      const user = await UserModel.findByRegistroAndEmail(registro_academico, email);
      if (!user) {
        return res.status(400).json({ error: 'Datos incorrectos' });
      }

      const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
      await UserModel.updatePassword(user.id, hashedPassword);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({ error: 'Error al reestablecer contraseña' });
    }
  }
}

module.exports = AuthController;
