
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'manager';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for convenience (optional quick access)
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@honeywell.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'analyst@honeywell.com',
    name: 'Data Analyst',
    role: 'analyst'
  },
  {
    id: '3',
    email: 'manager@honeywell.com',
    name: 'Business Manager',
    role: 'manager'
  }
];

// Helper function to generate user from email
const generateUserFromEmail = (email: string): User => {
  // Check if it's a demo user first
  const demoUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (demoUser) {
    return demoUser;
  }

  // Generate user data from email
  const emailParts = email.split('@');
  const username = emailParts[0];
  
  // Extract potential name from email
  const nameParts = username.split(/[._-]/);
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts[1] || '';
  const displayName = lastName ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}` : firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Assign default role based on email pattern or default to analyst
  let role: 'admin' | 'analyst' | 'manager' = 'analyst';
  if (username.includes('admin')) {
    role = 'admin';
  } else if (username.includes('manager')) {
    role = 'manager';
  }

  return {
    id: Date.now().toString(), // Simple ID generation
    email: email.toLowerCase(),
    name: displayName,
    role
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on app load
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mockUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic validation - just check that email and password are provided
    if (!email || !password) {
      setIsLoading(false);
      return { success: false, error: 'Email and password are required' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Accept any email and password combination
    const user = generateUserFromEmail(email);
    
    try {
      setUser(user);
      localStorage.setItem('mockUser', JSON.stringify(user));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error storing user:', error);
      setIsLoading(false);
      return { success: false, error: 'Failed to store user session' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
