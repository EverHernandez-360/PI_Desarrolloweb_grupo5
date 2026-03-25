import React, { useState } from 'react';
import AuthService from '../services/authService';

function ForgotPasswordForm() {
  const [registro, setRegistro] = useState('');
  const [correo, setCorreo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.resetPassword(registro, correo, nuevaPassword);
      setMensaje(' Contraseña actualizada correctamente');
    } catch (error) {
      setMensaje('Error al actualizar contraseña');
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Registro Académico"
          value={registro}
          onChange={(e) => setRegistro(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          required
        />
        <button type="submit">Reestablecer contraseña</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default ForgotPasswordForm;
