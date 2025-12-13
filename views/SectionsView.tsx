import { useNavigate } from 'react-router-dom';

import { RECENT_ASSETS } from '../App';
import { useAppStore } from '../store/useAppStore';

import { ListView } from './ListView';

export function SectionsView() {
  const navigate = useNavigate();
  const isFavorite = useAppStore((state) => state.isFavorite);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const searchQuery = useAppStore((state) => state.searchQuery);

  // Filtrar apenas sections
  const sections = RECENT_ASSETS.filter((item) => item.type === 'Section');

  // Aplicar busca se houver
  const filteredSections = searchQuery
    ? sections.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sections;

  return (
    <ListView
      title="Sections"
      items={filteredSections}
      onAdd={() => navigate('/upload')}
      emptyMessage="Nenhuma section disponível ainda."
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      highlight={searchQuery}
    />
  );
}
