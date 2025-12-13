import { useNavigate } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { useAppStore } from '../store/useAppStore';

import { ListView } from './ListView';

export function FavoritesView() {
  const navigate = useNavigate();
  const favorites = useAppStore((state) => state.favorites);
  const isFavorite = useAppStore((state) => state.isFavorite);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const searchQuery = useAppStore((state) => state.searchQuery);

  // Filtrar apenas favoritos
  const favoriteAssets = RECENT_ASSETS.filter((item) => favorites.has(item.id));

  // Aplicar busca se houver
  const filteredFavorites = searchQuery
    ? favoriteAssets.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : favoriteAssets;

  return (
    <ListView
      title="Favorites"
      items={filteredFavorites}
      onAdd={() => navigate('/upload')}
      emptyMessage="Você ainda não tem favoritos. Adicione assets clicando no ícone de coração."
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      highlight={searchQuery}
    />
  );
}
