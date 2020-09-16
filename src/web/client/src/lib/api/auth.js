import client from './client';

export const login = ({ username, password }) =>
  client.post('/api/auth/login', { username, password });

export const register = ({ username, oldPassword, newPassword }) =>
  client.put('/api/auth/register', { username, oldPassword, newPassword });

export const check = () => client.get('/api/auth/check');

export const logout = () => client.get('/api/auth/logout');
