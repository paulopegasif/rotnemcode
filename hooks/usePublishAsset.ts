import { useState } from 'react';
import { toast } from 'sonner';

import { supabase } from '../lib/supabase';

/**
 * Hook para publicar/despublicar assets de forma segura via Edge Function
 *
 * ✅ Valida entitlements.can_publish
 * ✅ Verifica quotas de assets públicos
 * ✅ Previne bypass de validação via client
 *
 * @example
 * const { publishAsset, isPublishing } = usePublishAsset();
 *
 * await publishAsset('asset-uuid', true); // Publicar
 * await publishAsset('asset-uuid', false); // Despublicar
 */
export function usePublishAsset() {
  const [isPublishing, setIsPublishing] = useState(false);

  /**
   * Publica ou despublica um asset
   * @param assetId - UUID do asset
   * @param isPublic - true para publicar, false para despublicar
   * @returns Promise<boolean> - true se sucesso, false se erro
   */
  const publishAsset = async (assetId: string, isPublic: boolean): Promise<boolean> => {
    if (!assetId) {
      toast.error('ID do asset inválido');
      return false;
    }

    setIsPublishing(true);

    try {
      // 🔒 Chamada SEGURA via Edge Function
      const { data, error } = await supabase.functions.invoke('publish-asset', {
        body: { assetId, isPublic },
      });

      if (error) {
        // Tratar erros específicos da Edge Function
        const errorContext = error as {
          context?: { code?: string; quota?: { current?: number; limit?: number } };
        };
        const errorCode = errorContext.context?.code;

        switch (errorCode) {
          case 'CANNOT_PUBLISH': {
            toast.error('Você precisa do plano Pro para publicar assets', {
              description: 'Faça upgrade para desbloquear publicações ilimitadas',
              action: {
                label: 'Upgrade',
                onClick: () => {
                  // TODO: Navegar para página de pricing
                  console.log('Navegar para /pricing');
                },
              },
            });
            break;
          }

          case 'QUOTA_EXCEEDED': {
            const quota = errorContext.context?.quota;
            toast.error(`Limite de ${quota?.limit || '?'} assets públicos atingido`, {
              description: `Você tem ${quota?.current || '?'} assets públicos. Delete alguns para liberar espaço.`,
            });
            break;
          }

          case 'ENTITLEMENT_MISSING': {
            toast.error('Entitlements não configurados', {
              description: 'Entre em contato com o suporte',
            });
            break;
          }

          default: {
            toast.error('Erro ao publicar asset', {
              description: error.message || 'Erro desconhecido',
            });
          }
        }

        console.error('[usePublishAsset] Error:', error);
        return false;
      }

      // Sucesso
      if (data?.success) {
        toast.success(
          isPublic ? 'Asset publicado com sucesso!' : 'Asset despublicado com sucesso!'
        );
        return true;
      }

      // Resposta inesperada
      toast.error('Resposta inesperada do servidor');
      return false;
    } catch (err) {
      console.error('[usePublishAsset] Unexpected error:', err);
      toast.error('Erro inesperado ao processar requisição');
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publishAsset,
    isPublishing,
  };
}
