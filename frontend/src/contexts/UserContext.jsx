import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Firebase Auth user
  const [userData, setUserData] = useState(null); // Firestore profile (role etc.)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up any existing profile listener when auth user changes
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);

        // Live subscription so we see role updates as soon as they are written
        unsubscribeProfile = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              setUserData(snap.data());
            } else {
              // No profile yet – do not fabricate a role; UI will wait on this
              setUserData(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error('UserContext snapshot error:', err);
            setError(err.message);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('UserContext error:', err);
        setError(err.message);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const value = {
    user,
    userData,
    loading,
    error,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
