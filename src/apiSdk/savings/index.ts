import axios from 'axios';
import queryString from 'query-string';
import { SavingsInterface, SavingsGetQueryInterface } from 'interfaces/savings';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getSavings = async (query?: SavingsGetQueryInterface): Promise<PaginatedInterface<SavingsInterface>> => {
  const response = await axios.get('/api/savings', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createSavings = async (savings: SavingsInterface) => {
  const response = await axios.post('/api/savings', savings);
  return response.data;
};

export const updateSavingsById = async (id: string, savings: SavingsInterface) => {
  const response = await axios.put(`/api/savings/${id}`, savings);
  return response.data;
};

export const getSavingsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/savings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSavingsById = async (id: string) => {
  const response = await axios.delete(`/api/savings/${id}`);
  return response.data;
};
