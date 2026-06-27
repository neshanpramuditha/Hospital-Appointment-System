import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

import {
  login as loginService,
  logout as logoutService,
  registerPatient,
  getUserProfile,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Load current session
  // -----------------------------
  useEffect(() => {
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);

          const profile = await getUserProfile(
            session.user.id
          );

          setProfile(profile);
        } else {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // -----------------------------
  // Current Session
  // -----------------------------
  async function getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);

      const profile = await getUserProfile(
        session.user.id
      );

      setProfile(profile);
    }

    setLoading(false);
  }

  // -----------------------------
  // Register
  // -----------------------------
  async function register(data) {
    await registerPatient(data);
  }

  // -----------------------------
  // Login
  // -----------------------------
  async function login(email, password) {
    await loginService(email, password);
  }

  // -----------------------------
  // Logout
  // -----------------------------
  async function logout() {
    await logoutService();

    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,

        register,
        login,
        logout,

        isAuthenticated: !!user,

        role: profile?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}