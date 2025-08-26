// Mock authentication helpers using localStorage
import { mockUsers } from './mockData.js';

const AUTH_KEY = 'wellness_tracker_auth';
const USER_KEY = 'wellness_tracker_user';

// Authentication state management
export const authHelpers = {
  /**
   * Authenticate user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Object} { success: boolean, user?: Object, error?: string }
   */
  login: (email, password) => {
    try {
      // Find user in mock data
      const user = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Create user session (exclude password from stored data)
      const userSession = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        loginTime: new Date().toISOString()
      };

      // Store authentication state
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(userSession));

      return {
        success: true,
        user: userSession
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An error occurred during login'
      };
    }
  },

  /**
   * Register new user account
   * @param {string} email 
   * @param {string} password 
   * @param {string} name 
   * @returns {Object} { success: boolean, user?: Object, error?: string }
   */
  signup: (email, password, name) => {
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          error: 'An account with this email already exists'
        };
      }

      // Validate input
      if (!email || !password || !name) {
        return {
          success: false,
          error: 'All fields are required'
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }

      // Create new user
      const newUser = {
        id: Date.now(), // Simple ID generation for mock data
        email: email.toLowerCase(),
        password: password, // In real app, this would be hashed
        name: name.trim(),
        createdAt: new Date().toISOString()
      };

      // Add to mock users (in real app, this would be API call)
      mockUsers.push(newUser);

      // Create user session
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        loginTime: new Date().toISOString()
      };

      // Store authentication state
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(userSession));

      return {
        success: true,
        user: userSession
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'An error occurred during registration'
      };
    }
  },

  /**
   * Log out current user
   */
  logout: () => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
      
      // TODO: In real app, also invalidate server-side session
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Error during logout' };
    }
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    try {
      const authState = localStorage.getItem(AUTH_KEY);
      const userSession = localStorage.getItem(USER_KEY);
      
      return authState === 'true' && userSession !== null;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  /**
   * Get current user information
   * @returns {Object|null} User object or null if not authenticated
   */
  getCurrentUser: () => {
    try {
      if (!authHelpers.isAuthenticated()) {
        return null;
      }

      const userSession = localStorage.getItem(USER_KEY);
      return userSession ? JSON.parse(userSession) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Update current user information
   * @param {Object} updates - Object with fields to update
   * @returns {Object} { success: boolean, user?: Object, error?: string }
   */
  updateUser: (updates) => {
    try {
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Not authenticated' };
      }

      // Update user data
      const updatedUser = {
        ...currentUser,
        ...updates,
        id: currentUser.id, // Prevent ID changes
        updatedAt: new Date().toISOString()
      };

      // Save updated user
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'Failed to update user information'
      };
    }
  },

  /**
   * Validate session (check if stored session is still valid)
   * @returns {boolean}
   */
  validateSession: () => {
    try {
      const user = authHelpers.getCurrentUser();
      if (!user) return false;

      // Check if session is too old (e.g., 7 days)
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);

      if (daysDiff > 7) {
        authHelpers.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }
};

// Utility functions for form validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};
export default authHelpers;