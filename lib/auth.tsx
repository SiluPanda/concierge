import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Mocking firebase imports since firebase.ts isn't fully set up in provided files
// In a real scenario, you would import { auth } from './firebase' and firebase/auth methods
// import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase';

interface AuthContextType {
  user: { name?: string; email?: string; id?: string } | null;
  token: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock Auth Provider for demonstration
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Default to false for UI preview

  // Simulating auth state check
  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, ...);
    // return unsubscribe;
  }, []);

  const login = async () => {
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
        setUser({ name: "Demo User", email: "demo@example.com", id: "123" });
        setToken("mock-token");
        setIsLoading(false);
    }, 1000);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}