import { isSupabaseConfigured, supabase } from "./supabase";

const scheduleSelect = `
  id,
  doctor_id,
  available_date,
  start_time,
  end_time,
  created_at,
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
const notConfigured = () => ({ data: [], error: null });

export const getSchedules = async (filters = {}) => {
  if (!isSupabaseConfigured) return notConfigured();

  let query = supabase.from("schedules").select(scheduleSelect);

  if (filters.startDate) query = query.gte("available_date", filters.startDate);
  if (filters.endDate) query = query.lte("available_date", filters.endDate);
  if (filters.status === "upcoming") query = query.gte("available_date", today());
  if (filters.status === "expired") query = query.lt("available_date", today());
  if (filters.doctorId) query = query.eq("doctor_id", filters.doctorId);

  return await query
    .order("available_date", { ascending: true })
    .order("start_time", { ascending: true });
};

export const getScheduleById = async (id) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase.from("schedules").select(scheduleSelect).eq("id", id).single();
};

export const addSchedule = async (schedule) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase.from("schedules").insert([schedule]).select(scheduleSelect).single();
};

export const updateSchedule = async (id, schedule) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase
    .from("schedules")
    .update(schedule)
    .eq("id", id)
    .select(scheduleSelect)
    .single();
};

export const deleteSchedule = async (id) => {
  if (!isSupabaseConfigured) return { data: null, error: null };

  return await supabase.from("schedules").delete().eq("id", id);
};

export const getUpcomingSchedules = async () => getSchedules({ status: "upcoming" });

export const getExpiredSchedules = async () => getSchedules({ status: "expired" });

export const getSchedulesByDateRange = async (startDate, endDate) =>
  getSchedules({ startDate, endDate });

export const getScheduleDoctors = async () => {
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
