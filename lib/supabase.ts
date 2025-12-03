import { createClient } from '@supabase/supabase-js';

// As variáveis devem ser definidas no ambiente (Vite):
// VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variáveis VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY não configuradas. ' +
      'Crie um arquivo .env na raiz do projeto e defina as variáveis conforme .env.example.\n' +
      'Exemplo:\n' +
      'VITE_SUPABASE_URL=https://seu-projeto.supabase.co\n' +
      'VITE_SUPABASE_ANON_KEY=sua-chave-anon'
  );
}

// Usar valores dummy para evitar crash quando variáveis não estão configuradas
// Isso permite que o app rode em modo desenvolvimento sem backend
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
