import axios from 'axios';
import queryString from 'query-string';
import { PaymentsInterface, PaymentsGetQueryInterface } from 'interfaces/payments';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPayments = async (
  query?: PaymentsGetQueryInterface,
): Promise<PaginatedInterface<PaymentsInterface>> => {
  const response = await axios.get('/api/payments', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createPayments = async (payments: PaymentsInterface) => {
  const response = await axios.post('/api/payments', payments);
  return response.data;
};

export const updatePaymentsById = async (id: string, payments: PaymentsInterface) => {
  const response = await axios.put(`/api/payments/${id}`, payments);
  return response.data;
};

export const getPaymentsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/payments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePaymentsById = async (id: string) => {
  const response = await axios.delete(`/api/payments/${id}`);
  return response.data;
};
