import axiosInstance from "./axios";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  User,
} from "../types";
import { API_ENDPOINTS } from "../utils/constants";

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data!;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data!;
  },

  // Refresh access token
  refresh: async (
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await axiosInstance.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data.data!;
  },

  // Logout user
  logout: async (refreshToken: string): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.data!.user;
  },
};
