import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
// Import authService from the centralized services index
import { authService } from '../services';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setCurrentClinic: (clinicId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Attempting login with JWT');
      // Call the authService login method which should handle JWT token
      const response = await authService.login(email, password);
      
      // Verify we have a valid JWT response
      if (response && response.token && response.user) {
        console.log('AuthContext: JWT token received successfully');
        // Store user data from the JWT payload
        const userData = {
          ...response.user,
          // Ensure defaultClinicId is set for non-super admin users
          defaultClinicId: response.user.role !== 'SUPER_ADMIN' ? response.user.clinicId : response.user.defaultClinicId
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.error('AuthContext: Invalid JWT response format', response);
        throw new Error('Invalid login response: Missing token or user data');
      }
    } catch (err: any) {
      console.error('AuthContext: JWT login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Add the setCurrentClinic method
  const setCurrentClinic = async (clinicId: string) => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        
        // Call the service to update the clinic
        const updatedUser = await authService.setCurrentClinic(clinicId);
        
        if (updatedUser) {
          // Create a new user object with the updated clinic ID
          const newUser = {
            ...updatedUser,
            defaultClinicId: clinicId // Ensure the defaultClinicId is set correctly
          };
          
          // Update context state with the new user data
          setUser(newUser);
          
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(newUser));
          
          // Force a re-render by updating the isAuthenticated state
          setIsAuthenticated(true);
        } else {
          throw new Error('Failed to update clinic: No user data returned');
        }
      } catch (error: any) {
        console.error('Failed to update clinic:', error);
        setError(error.message || 'Failed to update clinic');
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      isAuthenticated,
      setCurrentClinic // Include the new method in the context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};