import React, { useState } from 'react';
import AuthService from '../services/authService';
import './LoginForm.css'; // reutilizamos estilos

function ForgotPasswordForm() {
  const [registro, setRegistro] = useState('');
  const [correo, setCorreo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await AuthService.resetPassword(registro, correo, nuevaPassword);
      setMensaje('Contraseña actualizada correctamente');
    } catch (error) {
      setError('Error al actualizar contraseña');
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h2>Recuperar Contraseña</h2>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <input
            type="text"
            placeholder="Registro Académico"
            value={registro}
            onChange={(e) => setRegistro(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Reestablecer contraseña</button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
