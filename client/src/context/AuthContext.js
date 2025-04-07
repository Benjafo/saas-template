import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Configure axios to send cookies
axios.defaults.withCredentials = true;


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // Removed token state

  // Set the base URL for API requests
  useEffect(() => {
    // Use the environment variable or fallback to a default
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
    console.log('API URL:', apiUrl);
    axios.defaults.baseURL = apiUrl;
    
    // Log additional information for debugging
    console.log('Environment:', process.env.NODE_ENV);
    console.log('withCredentials:', axios.defaults.withCredentials);
  }, []);

  // Check if user is authenticated on initial load by checking the cookie via the /me endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        // Request will automatically send the httpOnly cookie
        const res = await axios.get('/auth/me');
        console.log('Authentication successful:', res.data);
        setUser(res.data.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // If the request fails (e.g., 401), the user is not authenticated
        console.error('Authentication check failed:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Wait a bit for axios baseURL to be set
    setTimeout(checkAuth, 500);
  }, []); // Run only once on initial load

  // Register user
  // Register user
  const register = async (userData) => {
    try {
      // Server now sets the httpOnly cookie upon successful registration
      const res = await axios.post('/auth/register', userData);
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
  // Login user
  const login = async (email, password) => {
    try {
      // Server now sets the httpOnly cookie upon successful login
      const res = await axios.post('/auth/login', { email, password });
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
      await axios.get('/auth/logout');
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
      const res = await axios.patch('/api/v1/users/profile', userData);
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
      await axios.patch('/api/v1/auth/update-password', passwordData);
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
      await axios.post('/api/v1/auth/forgot-password', { email });
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
      await axios.patch(`/api/v1/auth/reset-password/${token}`, {
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
  // Delete account
  const deleteAccount = async () => {
    try {
      await axios.delete('/api/v1/auth/delete-me');
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
        loginWithGitHub
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
