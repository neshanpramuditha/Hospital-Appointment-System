import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

const createNoopClient = () => ({
  from() {
    return {
      select() {
        return {
          order: () => Promise.resolve({
            data: [],
            error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
          }),
        }
      },
      insert() {
        return Promise.resolve({
          data: null,
          error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
        })
      },
      update() {
        return Promise.resolve({
          data: null,
          error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
        })
      },
      delete() {
        return {
          eq: () => Promise.resolve({
            data: null,
            error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
          }),
        }
      },
    }
  },
})

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createNoopClient()

export { isSupabaseConfigured }