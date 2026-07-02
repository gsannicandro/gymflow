import apiClient from './axios';

export const authApi = {
  register: (userData) => apiClient.post('/v1/auth/register', userData),
  login: (credentials) => apiClient.post('/v1/auth/login', credentials),
  logout: () => apiClient.post('/v1/auth/logout'),
  getProfile: () => apiClient.get('/v1/auth/profile'),
  updateProfile: (userData) => apiClient.put('/v1/auth/profile', userData),
  changePassword: (data) => apiClient.put('/v1/auth/password', data),
  ownerGetCodes: () => apiClient.get('/v1/auth/owner/codes'),
  ownerCreateCode: () => apiClient.post('/v1/auth/owner/codes'),
  ownerDeleteCode: (id) => apiClient.delete(`/v1/auth/owner/codes/${id}`),
  ownerGetUsers: () => apiClient.get('/v1/auth/owner/users'),
  ownerDeleteUser: (id) => apiClient.delete(`/v1/auth/owner/users/${id}`)
};
