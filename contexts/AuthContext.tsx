import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock initial user state - normally would come from Firebase Auth
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // Simulate login
    setUser({
      id: '12345',
      name: 'Chinedu Okeke',
      email: 'chinedu.o@school.ng',
      schoolName: 'Lagoon Secondary School, Lagos',
      plan: 'free'
    });
  };

  const loginWithGoogle = () => {
    // Simulate Google Login
    setUser({
      id: 'g_12345',
      name: 'Amina Ibrahim',
      email: 'amina.i@gmail.com',
      schoolName: 'Google Verified School',
      plan: 'free'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isAuthenticated: !!user }}>
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