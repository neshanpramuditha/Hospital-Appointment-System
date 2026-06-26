import { supabase } from "./supabase";

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

export const addPatient = async (patient) => {
  return await supabase.from("patients").insert([patient]);
};

export const updatePatient = async (id, patient) => {
  return await supabase.from("patients").update(patient).eq("id", id);
};

export const deletePatient = async (id) => {
  return await supabase.from("patients").delete().eq("id", id);
};