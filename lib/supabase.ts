import { createClient } from '@supabase/supabase-js';

// As variáveis devem ser definidas no ambiente (Vite):
// VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Evitar falhas silenciosas; logar instruções em desenvolvimento
  console.warn(
    '[Supabase] Variáveis VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY não configuradas. ' +
      'Crie um arquivo .env e defina as variáveis conforme .env.example.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
