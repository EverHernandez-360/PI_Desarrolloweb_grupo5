import api from './api';

const AuthService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => localStorage.removeItem('token'),

  // 🔹 Nuevo método para restear contraseña 
  resetPassword: (registroAcademico, correo, nuevaPassword) =>
    api.post('/auth/reset-password', { registroAcademico, correo, nuevaPassword })
};

export default AuthService;
