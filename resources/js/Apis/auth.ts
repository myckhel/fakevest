import Http from "./Http";

export interface User {
  id: number;
  username: string;
  phone: string | null;
  email: string;
  fullname: string;
  gender?: string | null;
  dob?: string | null;
  next_of_kin?: string | null;
  address?: string | null;
  profile?: any;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  has_pin: boolean;
  avatar?: {
    thumb: string;
    medium: string;
    url: string;
    id?: number;
    metas?: {
      fallback: boolean;
    };
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  device_name?: string;
  device_type?: string;
  player_id?: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation?: string;
  username?: string;
  device_name?: string;
  device_type?: string;
  player_id?: string;
}

export interface SocialLoginResponse {
  url: string;
}

const AuthAPI = {
  /**
   * Login with email and password
   */
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return Http.post("/login", credentials);
  },

  /**
   * Register a new user
   */
  register: (userData: RegisterData, avatar?: File): Promise<AuthResponse> => {
    if (!avatar) {
      return Http.post("/register", userData);
    }

    const formData = new FormData();
    // Add user data to form
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    // Add avatar if provided
    formData.append("avatar", avatar);

    return Http.upload("/register", formData);
  },

  /**
   * Get current authenticated user
   */
  whoami: (): Promise<User> => {
    return Http.get("/whoami");
  },

  /**
   * Logout current user
   */
  logout: (): Promise<{ message: string }> => {
    return Http.get("/logout");
  },

  /**
   * Initiate social login flow
   */
  getSocialLoginUrl: (
    provider: "google" | "github" | "facebook"
  ): Promise<SocialLoginResponse> => {
    return Http.get(`/login/${provider}`);
  },

  /**
   * Complete social login using callback code
   */
  socialLoginCallback: (
    provider: "google" | "github" | "facebook",
    code: string
  ): Promise<AuthResponse> => {
    return Http.get(
      `/login/${provider}/callback?code=${encodeURIComponent(code)}`
    );
  },

  /**
   * Send password reset link
   */
  forgotPassword: (
    email: string
  ): Promise<{ message: string; status: boolean }> => {
    return Http.post("/password/forgot", { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string; status: boolean }> => {
    return Http.post("/password/reset", data);
  },

  /**
   * Change user password
   */
  changePassword: (data: {
    old_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string; status: boolean }> => {
    return Http.put("/users/password", data);
  },

  /**
   * Resend email verification link
   */
  resendEmailVerification: (): Promise<{ status: string }> => {
    return Http.post("/email/verification-notification");
  },

  /**
   * Verify email with verification link
   */
  verifyEmail: (id: string, hash: string): Promise<{ status: string }> => {
    return Http.get(`/email/verify/${id}/${hash}`);
  },
};

export default AuthAPI;
