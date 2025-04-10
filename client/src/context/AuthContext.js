import axios from 'axios'; // Keep this import for setting defaults
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configure axios defaults for any direct axios usage
axios.defaults.withCredentials = true;


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // Removed token state

  // Log API configuration on component mount
  useEffect(() => {
    // Log information for debugging
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', apiClient.defaults.baseURL);
    console.log('withCredentials:', apiClient.defaults.withCredentials);
  }, []);

  // Check if user is authenticated on initial load by checking the cookie via the /me endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        // Request will automatically send the httpOnly cookie
        const res = await apiClient.get('/auth/me');
        console.log('Authentication successful:', res.data);
        setUser(res.data.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // If the request fails (e.g., 401), the user is not authenticated
        console.error('Authentication check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Execute immediately since apiClient is already configured
    checkAuth();
  }, []); // Run only once on initial load

  // Register user
  const register = async (userData) => {
    try {
      // Server now sets the httpOnly cookie upon successful registration
      const res = await apiClient.post('/auth/register', userData);
      // The response no longer contains the token, just user data
      const { user: newUser } = res.data.data; // Adjusted to access user data correctly

      setUser(newUser);
      setIsAuthenticated(true);

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // Server now sets the httpOnly cookie upon successful login
      const res = await apiClient.post('/auth/login', { email, password });
      // The response no longer contains the token, just user data
      const { user: newUser } = res.data.data; // Adjusted to access user data correctly

      setUser(newUser);
      setIsAuthenticated(true);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call the server endpoint to clear the httpOnly cookie
      await apiClient.get('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear client-side state even if server call fails
      setUser(null);
      setIsAuthenticated(false);
      toast.error('Logout failed. Please try again.');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await apiClient.patch('/users/profile', userData);
      setUser(res.data.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update user password
  const updatePassword = async (passwordData) => {
    try {
      await apiClient.patch('/auth/update-password', passwordData);
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Request password reset
  const forgotPassword = async (email) => {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Reset password with token
  const resetPassword = async (token, password, passwordConfirm) => {
    try {
      await apiClient.patch(`/auth/reset-password/${token}`, {
        password,
        passwordConfirm,
      });
      toast.success('Password has been reset successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      await apiClient.delete('/auth/delete-me');
      // Also call logout to clear the cookie on the server
      await logout(); // Reuse the logout logic which clears state and cookie
      toast.info('Your account has been deleted');
      return { success: true };
    } catch (error) {
      // logout() already handles clearing client state on error
      const message = error.response?.data?.message || 'Failed to delete account';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      // Test the API endpoint
      const res = await apiClient.get('/test');
      console.log('Test API response:', res.data);
      
      // Also check database status
      try {
        const dbRes = await apiClient.get('/db-status');
        console.log('Database status:', dbRes.data);
        
        return { 
          success: true, 
          data: res.data,
          database: {
            status: dbRes.data.status,
            readyState: dbRes.data.readyState,
            host: dbRes.data.host
          }
        };
      } catch (dbError) {
        console.error('Database status check failed:', dbError);
        return { 
          success: true, 
          data: res.data,
          database: {
            status: 'unknown',
            error: dbError.toString()
          }
        };
      }
    } catch (error) {
      console.error('Test API error:', error);
      let errorDetails = {
        message: 'API test failed',
        type: 'unknown'
      };
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorDetails = {
          message: error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`,
          type: 'response_error',
          status: error.response.status,
          data: error.response.data
        };
      } else if (error.request) {
        // The request was made but no response was received
        errorDetails = {
          message: 'No response from server. The server might be down or unreachable.',
          type: 'no_response'
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        errorDetails = {
          message: `Request setup error: ${error.message}`,
          type: 'request_setup_error'
        };
      }
      
      if (error.code) {
        errorDetails.code = error.code;
      }
      
      if (error.message && error.message.includes('Network Error')) {
        errorDetails.message = 'Network error: The server might be down or unreachable.';
        errorDetails.type = 'network_error';
      }
      
      return { 
        success: false, 
        message: errorDetails.message,
        details: errorDetails,
        error: error.toString()
      };
    }
  };

  // Social login with Google
  const loginWithGoogle = async () => {
    try {
      // In a real application, this would redirect to Google OAuth
      // For this template, we'll simulate a successful login after a delay
      toast.info('Redirecting to Google login...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response data
      const mockUser = {
        name: 'Google User',
        email: 'google.user@example.com',
        role: 'user'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast.success('Google login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, message };
    }
  };
  
  // Social login with GitHub
  const loginWithGitHub = async () => {
    try {
      // In a real application, this would redirect to GitHub OAuth
      // For this template, we'll simulate a successful login after a delay
      toast.info('Redirecting to GitHub login...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response data
      const mockUser = {
        name: 'GitHub User',
        email: 'github.user@example.com',
        role: 'user'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast.success('GitHub login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'GitHub login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
        forgotPassword,
        resetPassword,
        deleteAccount,
        loginWithGoogle,
        loginWithGitHub,
        testApiConnection
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
