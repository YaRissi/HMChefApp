import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  username: string;
  access_token: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const useAuthState = () => useContext(AuthContext);

export const AuthState = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
