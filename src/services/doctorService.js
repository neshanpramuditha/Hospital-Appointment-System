import { supabase } from "./supabase";
import { ROLES } from "../utils/roles";

export async function createDoctorAccount(doctor) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: doctor.email,
    password: doctor.password,
  });

  if (authError) throw authError;

  const authUser = authData.user;

  if (!authUser?.id) {
    throw new Error("Doctor auth account was not created.");
  }

  const { error: userError } = await supabase.from("users").insert({
    id: authUser.id,
    full_name: doctor.full_name,
    email: doctor.email,
    role: ROLES.DOCTOR,
  });

  if (userError) throw userError;

  const { error: doctorError } = await supabase.from("doctors").insert({
    user_id: authUser.id,
    full_name: doctor.full_name,
    email: doctor.email,
    phone: doctor.phone,
    specialization_id: doctor.specialization_id,
  });

  if (doctorError) throw doctorError;

  return authUser;
}

export const getDoctors = async () => {
  return await supabase
    .from("doctors")
    .select(`
      *,
      specializations (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });
};

export const getDoctorById = async (id) => {
  return await supabase
    .from("doctors")
    .select(`
      *,
      specializations (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();
};

export const updateDoctor = async (id, doctor) => {
  return await supabase.from("doctors").update(doctor).eq("id", id);
};

export const deleteDoctor = async (id) => {
  return await supabase.from("doctors").delete().eq("id", id);
};