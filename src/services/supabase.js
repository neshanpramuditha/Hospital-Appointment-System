import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

const createNoopClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
    signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
    signOut: () => Promise.resolve({ error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
    signInWithOAuth: () => Promise.resolve({ data: { url: null }, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
    updateUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from() {
    return {
      select() {
        return {
          order: () => Promise.resolve({
            data: [],
            error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'),
          }),
          maybeSingle: () => Promise.resolve({
            data: null,
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
