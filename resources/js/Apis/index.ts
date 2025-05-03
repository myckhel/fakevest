import Http from "./Http";
import AuthAPI from "./auth";
import UserAPI from "./user";
import SavingsAPI from "./savings";
import TransactionsAPI from "./transactions";

// Export all services
const API = {
  http: Http,
  auth: AuthAPI,
  user: UserAPI,
  savings: SavingsAPI,
  transactions: TransactionsAPI,
};

export default API;
