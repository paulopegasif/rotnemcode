import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export interface UserQuota {
  current_public_count: number;
  max_allowed: number;
  can_publish_more: boolean;
  tier: 'free' | 'pro';
}

/**
 * Hook para buscar quota de publicação do usuário
 * - Chama supabase.rpc('get_user_publish_quota')
 * - Retorna: current_public_count, max_allowed, can_publish_more, tier
 * - Função refetch() manual para recarregar após ações
 * - isLoading state durante fetch inicial
 */
export function useGetQuota() {
  const { user } = useAuth();
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('get_user_publish_quota');

      if (rpcError) {
        throw rpcError;
      }

      if (data) {
        setQuota({
          current_public_count: data.current_public_count || 0,
          max_allowed: data.max_allowed || 5,
          can_publish_more: (data.current_public_count || 0) < (data.max_allowed || 5),
          tier: data.tier || 'free',
        });
      }
    } catch (err) {
      console.error('Error fetching quota:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar quota');

      // Toast apenas em erro crítico
      if (err instanceof Error && err.message.includes('PGRST')) {
        toast.error('Erro ao carregar sua quota');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch inicial quando user muda
  useEffect(() => {
    fetchQuota();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return {
    quota,
    isLoading,
    error,
    refetch: fetchQuota, // Função manual para recarregar após ações
  };
}
