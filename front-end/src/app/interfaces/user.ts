export interface User {
  name: string;
  userName: string;
  email: string;
  password: string;
  type: boolean;
  workingHour?: number;
  status: boolean;
  available?: boolean;
  tokens: object[];
  manager_id?: string;
  employees?: object[];
  company_id?: string;
}
