import axios from 'axios';
import queryString from 'query-string';
import { BillsInterface, BillsGetQueryInterface } from 'interfaces/bills';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBills = async (query?: BillsGetQueryInterface): Promise<PaginatedInterface<BillsInterface>> => {
  const response = await axios.get('/api/bills', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBills = async (bills: BillsInterface) => {
  const response = await axios.post('/api/bills', bills);
  return response.data;
};

export const updateBillsById = async (id: string, bills: BillsInterface) => {
  const response = await axios.put(`/api/bills/${id}`, bills);
  return response.data;
};

export const getBillsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bills/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBillsById = async (id: string) => {
  const response = await axios.delete(`/api/bills/${id}`);
  return response.data;
};
