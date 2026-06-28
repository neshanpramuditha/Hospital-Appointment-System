import { supabase } from "./supabase";
import { ROLES } from "../utils/roles";

/* Register Patient */
export async function registerPatient({
  firstName,
  lastName,
  email,
  password,
}) {
  // Create authentication account
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const authUser = data.user;

  if (!authUser) {
    throw new Error("Registration failed.");
  }

  // Save user profile
  const { error: userError } = await supabase
    .from("users")
    .insert({
      id: authUser.id,
      full_name: `${firstName} ${lastName}`,
      email,
      role: ROLES.PATIENT,
    });

  if (userError) throw userError;

  // Create patient profile
  const { error: patientError } = await supabase
    .from("patients")
    .insert({
      user_id: authUser.id,
    });

  if (patientError) throw patientError;

  return authUser;
}

/* Login */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Login failed.");
  }

  return data.user;
}

async function syncPatientProfileFromAuth(user) {
  if (!user?.id) {
    return;
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Google User";

  const { error: userError } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        email: user.email,
        role: ROLES.PATIENT,
      },
      { onConflict: "id" }
    );

  if (userError) {
    throw userError;
  }

  // Check whether a patient profile already exists
const { data: existingPatient, error: checkError } = await supabase
  .from("patients")
  .select("id")
  .eq("user_id", user.id)
  .maybeSingle();

if (checkError) {
  throw checkError;
}

if (!existingPatient) {
  const { error: patientError } = await supabase
    .from("patients")
    .insert({
      user_id: user.id,
    });

  if (patientError) {
    throw patientError;
  }
}
}

/* Google Login */
export async function loginWithGoogleCredential(credential) {
  if (!credential) {
    throw new Error("Google sign-in did not return a credential.");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: credential,
  });

  if (error) {
    console.error("Google login error:", error);
    throw new Error(error.message || "Google login failed.");
  }

  const authUser = data?.user ?? data?.session?.user;

  if (authUser) {
    await syncPatientProfileFromAuth(authUser);
  }

  return data;
}

/* Reset Password */
export async function requestPasswordReset(email) {
  const redirectTo = `${window.location.origin}/login`;

  const { error } = await supabase.auth.resetPasswordForEmail({
    email,
    redirectTo,
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

/* Logout */

export async function logout() {
  const { error } =
    await supabase.auth.signOut();

  if (error) throw error;
}

/* Current User */

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/* User Profile */

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data) {
    throw new Error(
      "User profile not found in users table."
    );
  }

  return data;
}