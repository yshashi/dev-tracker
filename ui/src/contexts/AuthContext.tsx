import React, { createContext, useCallback, useContext, useState } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loadUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading as true to load user on mount
  const apiUrl = import.meta.env.VITE_API_URL;

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/validate`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const authResponse = await response.json();
        setUser(authResponse.data); // Populate user from API response
      } else {
        logout();
      }
    } catch {
      logout(); // Clear user on error
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const authResponse = await response.json();
      setUser(authResponse.data.user);
      localStorage.setItem('authToken', authResponse.data.token); // Store only the token
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setLoading(false);
        throw new Error(errorData.message);
      }
  
      const data = await response.json();
      setUser(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    loading,
    loadUser,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};