import { useState, useCallback } from 'react';

// Custom hook managing attendance directory filter parameters
export function usePresensiFilter() {
  const [selectedJurusan, setSelectedJurusan] = useState<string>('ALL');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const resetFilters = useCallback(() => {
    setSelectedJurusan('ALL');
    setSelectedTingkat('ALL');
    setSearchQuery('');
  }, []);

  const isFilterActive =
    selectedJurusan !== 'ALL' ||
    selectedTingkat !== 'ALL' ||
    searchQuery.trim() !== '';

  return {
    selectedJurusan,
    setSelectedJurusan,
    selectedTingkat,
    setSelectedTingkat,
    searchQuery,
    setSearchQuery,
    resetFilters,
    isFilterActive,
  };
}
