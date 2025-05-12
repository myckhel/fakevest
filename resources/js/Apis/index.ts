import AuthAPI from './auth';
import Http from './Http';
import SavingsAPI from './savings';
import TransactionsAPI from './transactions';
import UserAPI from './user';
import WalletAPI from './wallet';

// Export all services
const API = {
  http: Http,
  auth: AuthAPI,
  user: UserAPI,
  savings: SavingsAPI,
  transactions: TransactionsAPI,
  wallet: WalletAPI,
};

export default API;
