import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

import {
  login as loginService,
  loginWithGoogleCredential as loginWithGoogleService,
  logout as logoutService,
  registerPatient,
  getUserProfile,
  requestPasswordReset as requestPasswordResetService,
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

    if (!supabase?.auth?.onAuthStateChange) {
      setLoading(false);
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
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
        } catch (err) {
          console.error("Auth State Error:", err);

          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // -----------------------------
  // Get Current Session
  // -----------------------------
  async function getSession() {
    try {
      const auth = supabase?.auth;

      if (!auth?.getSession) {
        setUser(null);
        setProfile(null);
        return;
      }

      const {
        data: { session },
      } = await auth.getSession();

      if (session?.user) {
        setUser(session.user);

        const profile = await getUserProfile(
          session.user.id
        );

        setProfile(profile);
      }
    } catch (err) {
      console.error("Session Error:", err);

      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Register
  // -----------------------------
  async function register(data) {
    return await registerPatient(data);
  }

  // -----------------------------
  // Login
  // -----------------------------
  async function login(email, password) {
    return await loginService(email, password);
  }

  // -----------------------------
  // Google Login
  // -----------------------------
  async function googleLogin(credential) {
    return await loginWithGoogleService(credential);
  }

  // -----------------------------
  // Reset Password
  // -----------------------------
  async function resetPassword(email) {
    return await requestPasswordResetService(email);
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
        googleLogin,
        resetPassword,
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

// Patient Profiles
export async function getPatientProfile(userId) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// Doctor Profiles
export async function getDoctorProfile(userId) {
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      *,
      specialization:specialization_id (
        id,
        name
      )
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}