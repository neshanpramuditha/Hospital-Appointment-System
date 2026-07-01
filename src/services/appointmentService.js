import { isSupabaseConfigured, supabase } from "./supabase";

const appointmentSelect = `
  id,
  patient_id,
  doctor_id,
  appointment_date,
  appointment_time,
  status,
  created_at,
  patients (
    id,
    full_name,
    email,
    phone
  ),
  doctors (
    id,
    full_name,
    email,
    phone,
    specializations (
      id,
      name
    )
  )
`;

const today = () => new Date().toISOString().slice(0, 10);
const activeStatuses = ["pending", "confirmed"];
const notConfigured = () => ({ data: [], error: null });

const hasDuplicateAppointment = async (appointment, ignoreId) => {
  let query = supabase
    .from("appointments")
    .select("id")
    .eq("doctor_id", appointment.doctor_id)
    .eq("appointment_date", appointment.appointment_date)
    .eq("appointment_time", appointment.appointment_time);

  if (ignoreId) query = query.neq("id", ignoreId);

  const { data, error } = await query.limit(1);

  if (error) return { error };
  if (data?.length) {
    return {
      error: new Error("This doctor already has an appointment for the selected date and time."),
    };
  }

  return { error: null };
};

export const getAppointments = async (filters = {}) => {
  if (!isSupabaseConfigured) return notConfigured();

  let query = supabase.from("appointments").select(appointmentSelect);

  if (filters.startDate) query = query.gte("appointment_date", filters.startDate);
  if (filters.endDate) query = query.lte("appointment_date", filters.endDate);
  if (filters.patientId) query = query.eq("patient_id", filters.patientId);
  if (filters.doctorId) query = query.eq("doctor_id", filters.doctorId);
  if (filters.status && !["active", "expired", "all"].includes(filters.status)) {
    query = query.eq("status", filters.status);
  }
  if (filters.status === "active") query = query.in("status", activeStatuses);
  if (filters.status === "expired") {
    query = query.lt("appointment_date", today()).not("status", "in", "(completed,cancelled)");
  }
  if (filters.dateFilter === "upcoming") query = query.gte("appointment_date", today());
  if (filters.dateFilter === "past") {
    query = query.lt("appointment_date", today());
  }
  if (filters.dateFilter === "expired") {
    query = query.lt("appointment_date", today()).not("status", "in", "(completed,cancelled)");
  }

  return await query
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });
};

export const getAppointmentById = async (id) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase.from("appointments").select(appointmentSelect).eq("id", id).single();
};

export const addAppointment = async (appointment) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const duplicate = await hasDuplicateAppointment(appointment);
  if (duplicate.error) return { data: null, error: duplicate.error };

  return await supabase
    .from("appointments")
    .insert([appointment])
    .select(appointmentSelect)
    .single();
};

export const updateAppointment = async (id, appointment) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const duplicate = await hasDuplicateAppointment(appointment, id);
  if (duplicate.error) return { data: null, error: duplicate.error };

  return await supabase
    .from("appointments")
    .update(appointment)
    .eq("id", id)
    .select(appointmentSelect)
    .single();
};

export const deleteAppointment = async (id) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase.from("appointments").delete().eq("id", id);
};

export const updateAppointmentStatus = async (id, status) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select(appointmentSelect)
    .single();
};

export const getUpcomingAppointments = async () =>
  getAppointments({ status: "active", dateFilter: "upcoming" });

export const getExpiredAppointments = async () =>
  getAppointments({ dateFilter: "expired" });

export const getAppointmentsByDateRange = async (startDate, endDate) =>
  getAppointments({ startDate, endDate });

export const getAppointmentPatients = async () => {
  if (!isSupabaseConfigured) return notConfigured();

  return await supabase
    .from("patients")
    .select("id, full_name, phone")
    .order("full_name", { ascending: true });
};

export const getAppointmentDoctors = async () => {
  if (!isSupabaseConfigured) return notConfigured();

  return await supabase
    .from("doctors")
    .select(`
      id,
      full_name,
      specializations (
        id,
        name
      )
    `)
    .order("full_name", { ascending: true });
};
