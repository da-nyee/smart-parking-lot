import client from './client';

export const editPeriod = ({ newPeriod }) =>
  client.put('/api/setting/period', { newPeriod });

export const getPeriod = () => client.get('/api/setting/period');
