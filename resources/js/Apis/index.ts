import AuthAPI from './auth';
import Http from './Http';
import PaymentOptionsAPI from './paymentOptions';
import PaystackAPI from './paystack';
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
  paymentOptions: PaymentOptionsAPI,
  paystack: PaystackAPI,
};

export default API;
