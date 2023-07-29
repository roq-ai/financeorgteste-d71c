import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PaymentsInterface {
  id?: string;
  amount: number;
  date: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PaymentsGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
