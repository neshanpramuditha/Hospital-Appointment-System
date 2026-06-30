import { supabase } from "./supabase";
import { ROLES } from "../utils/roles";

const patientWriteFields = [
  "user_id",
  "full_name",
  "email",
  "phone",
  "date_of_birth",
];

function toPatientPayload(patient) {
  return patientWriteFields.reduce((payload, field) => {
    if (patient[field] !== undefined) {
      payload[field] = patient[field] || null;
    }

    return payload;
  }, {});
}

export async function createPatientAccount(patient) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: patient.email,
    password: patient.password,
  });

  if (authError) throw authError;

  const authUser = authData.user;

  if (!authUser?.id) {
    throw new Error("Patient auth account was not created.");
  }

  const { error: userError } = await supabase.from("users").insert({
    id: authUser.id,
    full_name: patient.full_name,
    email: patient.email,
    role: ROLES.PATIENT,
  });

  if (userError) throw userError;

  const { error: patientError } = await supabase.from("patients").insert({
    user_id: authUser.id,
    full_name: patient.full_name,
    email: patient.email,
    phone: patient.phone,
    date_of_birth: patient.date_of_birth,
  });

  if (patientError) throw patientError;

  return authUser;
}

export const getPatients = async () => {
  return await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
};

export const getPatientById = async (id) => {
  return await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();
};

export const getPatientByUserId = async (userId) => {
  return await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
};

export const updatePatient = async (id, patient) => {
  return await supabase
    .from("patients")
    .update(toPatientPayload(patient))
    .eq("id", id);
};

export const deletePatient = async (id) => {
  return await supabase.from("patients").delete().eq("id", id);
};

export const changePatientPassword = async (newPassword) => {
  return await supabase.auth.updateUser({ password: newPassword });
};
