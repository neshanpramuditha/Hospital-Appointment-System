import { supabase } from "./supabase";
import { ROLES } from "../utils/roles";

/*
|--------------------------------------------------------------------------
| Register Patient
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data.user;
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logout() {
  const { error } =
    await supabase.auth.signOut();

  if (error) throw error;
}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/*
|--------------------------------------------------------------------------
| User Profile
|--------------------------------------------------------------------------
*/

export async function getUserProfile(userId) {
  const { data, error } =
    await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

  if (error) throw error;

  return data;
}