import { StateCreator } from 'zustand';
import API from '../../api';
import { LoginCredentials, RegisterData, User } from '../../api/auth';

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData, avatar?: File) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  getSocialLoginUrl: (provider: 'google' | 'github' | 'facebook') => Promise<string>;
  handleSocialLogin: (provider: 'google' | 'github' | 'facebook', code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string, status: boolean }>;
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) => Promise<{ message: string, status: boolean }>;
  changePassword: (data: { old_password: string; password: string; password_confirmation: string }) => Promise<{ message: string, status: boolean }>;
}

// Create the store
export const useAuthStore: StateCreator<AuthState> = (set, get) => ({
  // Initial state
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  
  // Actions
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await API.auth.login(credentials);
      const { user, token } = response;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      set({ 
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (userData, avatar) => {
    set({ isLoading: true });
    try {
      const response = await API.auth.register(userData, avatar);
      const { user, token } = response;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      set({ 
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await API.auth.logout();
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      set({ 
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  checkAuth: async () => {
    const token = get().token;
    if (!token) return;
    
    set({ isLoading: true });
    try {
      const user = await API.auth.whoami();
      set({ 
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem('token');
      
      set({ 
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },
  
  updateProfile: async (data) => {
    const user = get().user;
    if (!user) throw new Error('User not authenticated');
    
    set({ isLoading: true });
    try {
      const updatedUser = await API.user.updateProfile(user.id, data);
      set({ 
        user: updatedUser,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateAvatar: async (file) => {
    const user = get().user;
    if (!user) throw new Error('User not authenticated');
    
    set({ isLoading: true });
    try {
      const updatedUser = await API.user.updateAvatar(user.id, file);
      set({ 
        user: updatedUser,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  getSocialLoginUrl: async (provider) => {
    try {
      const response = await API.auth.getSocialLoginUrl(provider);
      return response.url;
    } catch (error) {
      throw error;
    }
  },
  
  handleSocialLogin: async (provider, code) => {
    set({ isLoading: true });
    try {
      const response = await API.auth.socialLoginCallback(provider, code);
      const { user, token } = response;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      set({ 
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const response = await API.auth.forgotPassword(email);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  resetPassword: async (data) => {
    set({ isLoading: true });
    try {
      const response = await API.auth.resetPassword(data);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  changePassword: async (data) => {
    set({ isLoading: true });
    try {
      const response = await API.auth.changePassword(data);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
});