import api from './api';

const userService = {
  getUserByRegistro: async (registro) => {
    const response = await api.get(`/users/by-registro/${registro}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};

export default userService;
