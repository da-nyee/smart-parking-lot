import client from './client';

export const getParking = () => client.get('/api/board/parking');
