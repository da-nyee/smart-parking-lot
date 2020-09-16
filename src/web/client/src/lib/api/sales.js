import client from './client';

export const editCharge = ({ newCharge }) =>
  client.put('/api/sales/charge', { newCharge });

export const getCharge = () => client.get('/api/sales/charge');
