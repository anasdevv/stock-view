import api from '@/utils/api-client';
import { useQuery } from '@tanstack/react-query';

const fetchIndexes = async () => {
  const { data } = await api.get('/stock/indices');
  return data;
};

export const useGetIndices = () => {
  const { data, isError, isLoading } = useQuery({
    queryFn: async () => await fetchIndexes(),
    queryKey: ['indices'],
  });
  return { data: data?.results ?? [], isError, isLoading };
};
