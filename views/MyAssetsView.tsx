import { Globe, Lock, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { usePublishAsset } from '../hooks/usePublishAsset';
import { supabase } from '../lib/supabase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Asset {
  id: string;
  title: string;
  description: string | null;
  type: string;
  is_public: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
}

export function MyAssetsView() {
  const navigate = useNavigate();
  const { publishAsset, isPublishing } = usePublishAsset();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssets = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Você precisa estar logado');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('assets')
        .select(
          'id, title, description, type, is_public, thumbnail_url, created_at, updated_at, views_count, likes_count'
        )
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching assets:', error);
        toast.error('Erro ao carregar assets');
        return;
      }

      setAssets(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Erro inesperado ao carregar assets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssets();
  };

  const handleTogglePublish = async (assetId: string, currentIsPublic: boolean) => {
    const success = await publishAsset(assetId, !currentIsPublic);

    if (success) {
      // Atualizar estado local
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === assetId ? { ...asset, is_public: !currentIsPublic } : asset
        )
      );
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 30) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meus Assets</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-32 bg-muted rounded mb-4" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Assets</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {assets.length} {assets.length === 1 ? 'asset' : 'assets'} •{' '}
            {assets.filter((a) => a.is_public).length} público
            {assets.filter((a) => a.is_public).length !== 1 && 's'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => navigate('/upload')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Asset
          </Button>
        </div>
      </div>

      {assets.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-6">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Nenhum asset ainda</h3>
              <p className="text-muted-foreground text-sm">Comece criando seu primeiro asset</p>
            </div>
            <Button onClick={() => navigate('/upload')}>Criar Asset</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <Card
              key={asset.id}
              className="overflow-hidden flex flex-col hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                {asset.thumbnail_url ? (
                  <img
                    src={asset.thumbnail_url}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl font-bold text-primary/20">
                    {asset.title.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Badge de status */}
                <div className="absolute top-2 right-2">
                  {asset.is_public ? (
                    <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
                      <Globe className="h-3 w-3 mr-1" />
                      Público
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      <Lock className="h-3 w-3 mr-1" />
                      Privado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
                      {asset.title}
                    </h3>
                    {asset.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {asset.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <Badge variant="outline" className="text-xs">
                    {asset.type}
                  </Badge>
                  <span>{getRelativeTime(asset.updated_at)}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">👁️ {asset.views_count}</span>
                  <span className="flex items-center gap-1">❤️ {asset.likes_count}</span>
                </div>

                {/* Ações */}
                <div className="mt-auto flex gap-2">
                  <Button
                    variant={asset.is_public ? 'outline' : 'default'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTogglePublish(asset.id, asset.is_public)}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : asset.is_public ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Despublicar
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Publicar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar edição
                      toast.info('Edição em desenvolvimento');
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
