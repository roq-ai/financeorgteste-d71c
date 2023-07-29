import axios from 'axios';
import queryString from 'query-string';
import { EarningsInterface, EarningsGetQueryInterface } from 'interfaces/earnings';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getEarnings = async (
  query?: EarningsGetQueryInterface,
): Promise<PaginatedInterface<EarningsInterface>> => {
  const response = await axios.get('/api/earnings', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createEarnings = async (earnings: EarningsInterface) => {
  const response = await axios.post('/api/earnings', earnings);
  return response.data;
};

export const updateEarningsById = async (id: string, earnings: EarningsInterface) => {
  const response = await axios.put(`/api/earnings/${id}`, earnings);
  return response.data;
};

export const getEarningsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/earnings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEarningsById = async (id: string) => {
  const response = await axios.delete(`/api/earnings/${id}`);
  return response.data;
};
