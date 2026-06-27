import { supabase } from "./supabase";

export async function registerPatient({
  firstName,
  lastName,
  email,
  password,
}) {
  // Register with Supabase Authentication
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;

  // Save user profile
  const { error: userError } = await supabase
    .from("users")
    .insert({
      id: user.id,
      full_name: `${firstName} ${lastName}`,
      email,
      role: "patient",
    });

  if (userError) throw userError;

  // Create patient profile
  const { error: patientError } = await supabase
    .from("patients")
    .insert({
      user_id: user.id,
    });

  if (patientError) throw patientError;

  return user;
}

//Login function
export async function login(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) throw error;

  return data.user;
}

// logout function
export async function logout() {
  await supabase.auth.signOut();
}

// Get current user function
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

