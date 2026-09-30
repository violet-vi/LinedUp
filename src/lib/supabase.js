import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

console.log('URL exists:', !!supabaseUrl)
console.log('KEY exists:', !!supabaseKey)

export const supabase =
  createClient(supabaseUrl, supabaseKey)