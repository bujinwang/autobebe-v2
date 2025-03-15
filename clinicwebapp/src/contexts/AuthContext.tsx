import React, { createContext, useContext, useState, ReactNode } from 'react';
// Import the Clinic type from your types directory
import { Clinic } from '../types';

// Define user type
interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  defaultClinicId?: number; // Changed from string to number
  clinics?: Clinic[];
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setCurrentClinic: (clinicId: number) => void; // Changed from string to number
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  setCurrentClinic: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sample clinics - using number IDs now
  const sampleClinics: Clinic[] = [
    { id: 1, name: 'Main Clinic', address: '123 Main St', phone: '555-1234' },
    { id: 2, name: 'Downtown Branch', address: '456 Downtown Ave', phone: '555-5678' },
    { id: 3, name: 'Westside Clinic', address: '789 West Blvd', phone: '555-9012' },
  ];

  // Mock credentials for demonstration
  const validCredentials = [
    { 
      username: 'admin', 
      password: 'admin123', 
      id: '1', 
      name: 'Admin User', 
      role: 'admin',
      defaultClinicId: 1, // Changed to number
      clinics: sampleClinics
    },
    { 
      username: 'doctor', 
      password: 'doctor123', 
      id: '2', 
      name: 'Doctor Smith', 
      role: 'doctor',
      defaultClinicId: 2, // Changed to number
      clinics: [sampleClinics[1], sampleClinics[2]]
    },
    { 
      username: 'nurse', 
      password: 'nurse123', 
      id: '3', 
      name: 'Nurse Johnson', 
      role: 'nurse',
      defaultClinicId: 3, // Changed to number
      clinics: [sampleClinics[2]]
    },
  ];

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      const matchedUser = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (matchedUser) {
        // Extract user info (excluding password)
        const { password: _, ...userInfo } = matchedUser;
        setUser(userInfo);
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userInfo));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Function to set current clinic - updated to use number
  const setCurrentClinic = (clinicId: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        defaultClinicId: clinicId
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check for existing user session on initial load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    setCurrentClinic,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};