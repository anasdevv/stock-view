import api from './utils/api-client';

export const getDataByIndex = async ({
  symbol,
  date,
}: {
  symbol: string;
  date: string;
}) => {
  const { data } = await api.get(`/stock/indices/${symbol}?date=${date}`);
  return data;
};
