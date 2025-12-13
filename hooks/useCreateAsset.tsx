import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { AssetFormData } from '../src/lib/schemas/assetSchema';

interface CreateAssetResult {
  success: boolean;
  asset?: {
    id: string;
    title: string;
    type: string;
    is_public: boolean;
  };
  error?: string;
}

/**
 * Hook para criar assets no Supabase
 * - INSERT em assets com is_public = false (sempre privado ao criar)
 * - Toast de sucesso/erro
 * - Redirect para /my-assets após sucesso
 * - Estado isCreating para loading
 */
export function useCreateAsset() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const createAsset = async (data: AssetFormData): Promise<CreateAssetResult> => {
    if (!user) {
      toast.error('Você precisa estar logado para criar assets');
      return { success: false, error: 'Not authenticated' };
    }

    setIsCreating(true);

    try {
      // INSERT em assets com is_public = false (sempre privado ao criar)
      const { data: asset, error: insertError } = await supabase
        .from('assets')
        .insert({
          title: data.title,
          description: data.description || null,
          type: data.type,
          code: data.code,
          tags: data.tags || [],
          user_id: user.id,
          is_public: false, // CRÍTICO: Sempre privado ao criar
          thumbnail_url: null, // Futuro: gerar thumbnail
        })
        .select('id, title, type, is_public')
        .single();

      if (insertError) {
        throw insertError;
      }

      // Toast de sucesso
      toast.success('Asset criado com sucesso! 🎉', {
        description: `"${data.title}" foi salvo como privado.`,
      });

      // Delay pequeno para o toast aparecer antes do redirect
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect para /my-assets
      navigate('/my-assets');

      return { success: true, asset };
    } catch (error) {
      console.error('Error creating asset:', error);

      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      toast.error('Erro ao criar asset', {
        description: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAsset,
    isCreating,
  };
}
