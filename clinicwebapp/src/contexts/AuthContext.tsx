import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
// Import authService from the centralized services index
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setCurrentClinic: (clinicId: number) => void; // Add this method to the interface
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
        setUser(response.user);
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
  const setCurrentClinic = (clinicId: number) => {
    if (user) {
      // Update the user's defaultClinicId in local state
      setUser({
        ...user,
        defaultClinicId: clinicId
      });
      
      // Also update it in the authService/localStorage
      authService.setCurrentClinic(clinicId);
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