/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  function signUp(newUser) {
    localStorage.setItem("registeredUser", JSON.stringify(newUser));
  }

  function signIn(email, password) {
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      setUser(savedUser);
      localStorage.setItem("user", JSON.stringify(savedUser));
      return true;
    }

    return false;
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("user");
  }

  /**
   * updateProfile - saves updated user data to state and localStorage
   * @param {object} data - updated profile fields (name, phone, address, etc.)
   */
  function updateProfile(data) {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    // Also keep registeredUser in sync so future sign-ins reflect changes
    const registered = JSON.parse(localStorage.getItem("registeredUser"));
    if (registered && registered.email === updated.email) {
      localStorage.setItem("registeredUser", JSON.stringify(updated));
    }
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
