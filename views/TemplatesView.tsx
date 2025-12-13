import { useNavigate } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { useAppStore } from '../store/useAppStore';

import { ListView } from './ListView';

export function TemplatesView() {
  const navigate = useNavigate();
  const isFavorite = useAppStore((state) => state.isFavorite);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const searchQuery = useAppStore((state) => state.searchQuery);

  // Filtrar apenas templates
  const templates = RECENT_ASSETS.filter((item) => item.type === 'Template');

  // Aplicar busca se houver
  const filteredTemplates = searchQuery
    ? templates.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : templates;

  return (
    <ListView
      title="Templates"
      items={filteredTemplates}
      onAdd={() => navigate('/upload')}
      emptyMessage="Nenhum template disponível ainda."
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      highlight={searchQuery}
    />
  );
}
