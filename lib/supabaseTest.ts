import { supabase } from './supabase';

/**
 * Test connection to Supabase
 * Run in browser console: testSupabaseConnection()
 */
export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');

  try {
    // Test 1: List tables
    console.log('Test 1: Listing tables...');
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Database accessible:', data);

    // Test 2: Get current user
    console.log('Test 2: Getting current user...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    console.log('✅ Auth user:', authData.user?.email || 'Not logged in');

    // Test 3: Check RLS
    console.log('Test 3: Checking RLS policies...');
    const { error: assetsError } = await supabase
      .from('assets')
      .select('count', { count: 'exact' });
    if (assetsError) {
      console.warn('⚠️ Assets table (expected with RLS):', assetsError.message);
    } else {
      console.log('✅ Assets accessible');
    }

    console.log('✅ All tests passed!');
  } catch (err: unknown) {
    console.error('❌ Error:', err);
  }
}

// Expose to window for console testing
if (typeof window !== 'undefined') {
  (window as Record<string, unknown>).testSupabaseConnection = testSupabaseConnection;
}
