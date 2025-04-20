import Http from './Http';
import AuthAPI from './auth';
import UserAPI from './user';
import SavingsAPI from './savings';

// Export all services
const API = {
  http: Http,
  auth: AuthAPI,
  user: UserAPI,
  savings: SavingsAPI,
};

export default API;