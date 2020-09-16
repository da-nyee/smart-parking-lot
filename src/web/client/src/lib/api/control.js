import client from './client';

export const changeStatus = ({ name, status }) =>
  client.put('api/control/status', { name, status });

export const getStatus = () => client.get('api/control/status');

export const initializeStatus = () => client.get('api/control/init');
