'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/hooks/useApi/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State from localStorage on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          // clear invalid state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('mango_token');
          localStorage.removeItem('mango_user');
        }
      }
      setLoading(false);
    }
  }, []);

  // Save auth state helper
  const saveAuthSession = (token, userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('mango_token', token);
      localStorage.setItem('mango_user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  // Clear auth session helper
  const clearAuthSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('mango_token');
      localStorage.removeItem('mango_user');
      setUser(null);
    }
  };

  // 1. Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { token, user: userData } = response.data;
        saveAuthSession(token, userData);
        return { success: true, user: userData };
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during login'
      };
    }
  };

  // 2. Register
  const register = async (fullName, email, phone, password, image = null) => {
    try {
      const response = await api.post('/auth/signup', {
        fullName,
        email,
        phone,
        password,
        image
      });
      if (response.data?.success) {
        const { token, user: userData } = response.data;
        saveAuthSession(token, userData);
        return { success: true, user: userData };
      }
      return { success: false, message: response.data?.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during registration'
      };
    }
  };

  // 3. Logout
  const logout = () => {
    clearAuthSession();
    // Redirect if window object is available
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // 4. Search Customer (for password reset)
  const searchCustomer = async (query) => {
    try {
      const response = await api.get(`/auth/search-customer`, {
        params: { query }
      });
      if (response.data?.success) {
        return { success: true, customers: response.data.customers };
      }
      return { success: false, message: response.data?.message || 'Search failed' };
    } catch (error) {
      console.error('Search customer error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during search'
      };
    }
  };

  // 5. Forgot Password (OTP request)
  const forgotPassword = async (customerId, method) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        customerId,
        method
      });
      if (response.data?.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data?.message || 'Failed to send OTP' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred while sending OTP'
      };
    }
  };

  // 6. Verify OTP
  const verifyOtp = async (customerId, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { customerId, otp });
      if (response.data?.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data?.message || 'Invalid OTP' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during OTP verification'
      };
    }
  };

  // 7. Reset Password
  const resetPassword = async (customerId, otp, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        customerId,
        otp,
        newPassword
      });
      if (response.data?.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data?.message || 'Failed to reset password' };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during password reset'
      };
    }
  };

  // 8. Upload Profile Image
  const uploadImage = async (file, folder = 'general') => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(`/upload`, formData, {
        params: { folder },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        return {
          success: true,
          url: response.data.url,
          public_id: response.data.public_id
        };
      }
      return { success: false, message: response.data?.message || 'Upload failed' };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during image upload'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        searchCustomer,
        forgotPassword,
        verifyOtp,
        resetPassword,
        uploadImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
