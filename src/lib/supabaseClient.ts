// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Bu bilgileri Supabase projenizin ayarlar (Settings -> API) kısmında bulabilirsiniz.
// NOT: Gerçek projelerde bu bilgileri doğrudan buraya yazmak yerine ".env" dosyasında saklamak daha güvenlidir.
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL' // Buraya Supabase URL'ini yaz
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Buraya Supabase Anon Key'ini yaz

export const supabase = createClient(supabaseUrl, supabaseAnonKey)