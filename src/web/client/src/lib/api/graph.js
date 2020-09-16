import client from './client';

export const getSales = ({ from, to }) =>
  client.get(`api/graph/sales?from=${from}&to=${to}`);
export const getUsage = ({ date }) =>
  client.get(`api/graph/usage?date=${date}`);
