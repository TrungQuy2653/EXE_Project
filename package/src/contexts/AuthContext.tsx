'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '@/services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info'; isVisible: boolean } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmpassword: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean } | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      // Backend không có /me endpoint, tạm thời bỏ qua
      console.log('⚠️ Backend không có /me endpoint, bỏ qua fetchUser');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      console.log('🔐 Login response:', response);
      
      // Kiểm tra response format
      if (!response || !response.token || !response.data) {
        throw new Error('Response không đúng format từ server');
      }
      
      // Backend trả về { token, data: { id, username, email, role } }
      const { token: authToken, data: userData } = response;
      
      // Tạo user object từ data
      const user = {
        _id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(user);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      showToast('Đăng nhập thành công! Chào mừng bạn trở lại! 🎉', 'success');
    } catch (error: any) {
      showToast(error.message || 'Đăng nhập thất bại! Vui lòng kiểm tra email và mật khẩu.', 'error');
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string, confirmpassword: string) => {
    try {
      console.log('🚀 Starting registration...', { username, email, password: '***', confirmpassword: '***' });
      
      const response = await apiService.register({ username, email, password, confirmpassword });
      console.log('✅ Registration response:', response);
      
      // Kiểm tra response format
      if (!response || !response.data || !response.token) {
        throw new Error('Response không đúng format từ server');
      }
      
      // Backend trả về { message, data: { id, username, email, role }, token }
      const { data: userData, token: authToken } = response;
      
      // Tạo user object từ data
      const user = {
        _id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(user);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      
      console.log('🎉 Registration successful!');
      showToast('Đăng ký thành công! Chào mừng bạn đến với EXE Project! 🎉', 'success');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      showToast(error.message || 'Đăng ký thất bại! Vui lòng thử lại.', 'error');
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast!, isVisible: false });
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    toast,
    showToast,
    hideToast,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
