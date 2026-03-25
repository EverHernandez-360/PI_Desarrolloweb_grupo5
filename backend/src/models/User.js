const pool = require('../config/database');

class UserModel {
  static async create(userData) {
    const { registro_academico, nombres, apellidos, email, password_hash } = userData;
    
    const query = `
      INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(query, [
      registro_academico,
      nombres,
      apellidos,
      email,
      password_hash
    ]);
    return { id: result.insertId, ...userData };
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT id, registro_academico, nombres, apellidos, email, fecha_creacion FROM usuarios WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async update(id, userData) {
    const updates = Object.keys(userData)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(userData);
    
    const query = `UPDATE usuarios SET ${updates} WHERE id = ?`;
    
    await pool.execute(query, [...values, id]);
    return this.findById(id);
  }

  //  Nuevo: buscar por registro académico y email
  static async findByRegistroAndEmail(registro_academico, email) {
    const query = 'SELECT * FROM usuarios WHERE registro_academico = ? AND email = ?';
    const [rows] = await pool.execute(query, [registro_academico, email]);
    return rows[0] || null;
  }

  // Nuevo: actualizar contraseña
  static async updatePassword(id, password_hash) {
    const query = 'UPDATE usuarios SET password_hash = ? WHERE id = ?';
    await pool.execute(query, [password_hash, id]);
    return this.findById(id);
  }
}

module.exports = UserModel;
