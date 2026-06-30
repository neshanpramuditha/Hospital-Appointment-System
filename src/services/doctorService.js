import { supabase } from "./supabase";
import { ROLES } from "../utils/roles";

const doctorSelect = `
  *,
  specializations (
    id,
    name
  )
`;

const doctorWriteFields = [
  "user_id",
  "full_name",
  "email",
  "phone",
  "specialization_id",
];

function toDoctorPayload(doctor) {
  return doctorWriteFields.reduce((payload, field) => {
    if (doctor[field] !== undefined) {
      payload[field] = doctor[field] || null;
    }

    return payload;
  }, {});
}

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
    .select(doctorSelect)
    .order("created_at", { ascending: false });
};

export const getDoctorById = async (id) => {
  return await supabase
    .from("doctors")
    .select(doctorSelect)
    .eq("id", id)
    .single();
};

export const getDoctorByUserId = async (userId) => {
  return await supabase
    .from("doctors")
    .select(doctorSelect)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
};

export const updateDoctor = async (id, doctor) => {
  return await supabase
    .from("doctors")
    .update(toDoctorPayload(doctor))
    .eq("id", id);
};

export const deleteDoctor = async (id) => {
  return await supabase.from("doctors").delete().eq("id", id);
};

export const changeDoctorPassword = async (newPassword) => {
  return await supabase.auth.updateUser({ password: newPassword });
};
