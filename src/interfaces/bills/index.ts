import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BillsInterface {
  id?: string;
  amount: number;
  due_date: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface BillsGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
