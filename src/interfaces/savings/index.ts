import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SavingsInterface {
  id?: string;
  goal_amount: number;
  current_amount: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface SavingsGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
