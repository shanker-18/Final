import React, { createContext, useContext, useState } from 'react';

// Legacy auth context stub; all functions are no-ops since external auth is removed.

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup() {}
  async function login() {}
  async function logout() {}
  async function signInWithGoogle() {}
  async function updateUserProfile() {}

  const [currentUser, setCurrentUser] = useState(null);
  const [loading] = useState(false);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 