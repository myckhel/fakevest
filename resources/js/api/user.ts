import Http from './Http';
import { User } from './auth';

export interface ProfileUpdateData {
  fullname?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  next_of_kin?: string;
}

export interface PortfolioStats {
  thisMonth: number;
  thisYear: number;
  thisWeek: number;
}

export interface Portfolio {
  lifetime: number;
  balance_change: number;
  balance_change_percentage: number;
  thisMonth: number;
  thisYear: number;
  thisWeek: number;
  net: {
    savings: number;
    wallet: number;
  };
  chart: number[];
}

const UserAPI = {
  /**
   * Get user profile
   */
  getProfile: (userId: number): Promise<User> => {
    return Http.get(`/users/${userId}`);
  },

  /**
   * Update user profile
   */
  updateProfile: (userId: number, data: ProfileUpdateData): Promise<User> => {
    return Http.put(`/users/${userId}`, data);
  },

  /**
   * Upload user avatar
   */
  updateAvatar: (userId: number, file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return Http.upload(`/users/${userId}/avatar`, formData);
  },

  /**
   * Update user pin
   */
  updatePin: (data: { pin: string; old_pin?: string; pin_confirmation?: string }): Promise<{ message: string; status: boolean }> => {
    return Http.put(`/users/pin`, data);
  },

  /**
   * Verify user pin
   */
  verifyPin: (pin: string): Promise<{ message: string; status: boolean }> => {
    return Http.get(`/users/pin?pin=${pin}`);
  },

  /**
   * Get user portfolio summary
   */
  getPortfolio: (): Promise<Portfolio> => {
    return Http.get('/users/portfolio');
  },

  /**
   * Get random users (useful for testing)
   */
  getRandomUsers: (page: number = 1): Promise<any> => {
    return Http.get(`/users/random?page=${page}`);
  }
};

export default UserAPI;