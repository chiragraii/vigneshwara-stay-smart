import { getRouteApi } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import type { FiltersState, RoomCategory, SortBy } from '@/types/room';

const routeApi = getRouteApi('/rooms');

const DEFAULTS: FiltersState = {
  sortBy: 'price_asc',
  page: 1,
  limit: 9,
  isAvailable: true,
  view: 'grid',
};

function parseArray(val?: string): string[] | undefined {
  if (!val) return undefined;
  const arr = val.split(',').filter(Boolean);
  return arr.length ? arr : undefined;
}

export function parseFiltersFromSearch(search: Record<string, unknown>): FiltersState {
  const s = search as Record<string, string | undefined>;
  return {
    category: (s.category as RoomCategory) ?? '',
    minPrice: s.minPrice ? Number(s.minPrice) : undefined,
    maxPrice: s.maxPrice ? Number(s.maxPrice) : undefined,
    maxGuests: s.maxGuests ? Number(s.maxGuests) : undefined,
    bedType: parseArray(s.bedType),
    viewType: parseArray(s.viewType),
    amenities: parseArray(s.amenities),
    isAvailable: s.isAvailable !== 'false',
    isFeatured: s.isFeatured === 'true' ? true : undefined,
    minRating: s.minRating ? Number(s.minRating) : undefined,
    sortBy: (s.sortBy as SortBy) || DEFAULTS.sortBy,
    search: s.search,
    page: s.page ? Number(s.page) : DEFAULTS.page,
    limit: s.limit ? Number(s.limit) : DEFAULTS.limit,
    view: (s.view as 'grid' | 'list') || DEFAULTS.view,
  };
}

export function filtersToSearchParams(filters: FiltersState): Record<string, string | undefined> {
  return {
    category: filters.category || undefined,
    minPrice: filters.minPrice != null ? String(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice != null ? String(filters.maxPrice) : undefined,
    maxGuests: filters.maxGuests != null ? String(filters.maxGuests) : undefined,
    bedType: filters.bedType?.length ? filters.bedType.join(',') : undefined,
    viewType: filters.viewType?.length ? filters.viewType.join(',') : undefined,
    amenities: filters.amenities?.length ? filters.amenities.join(',') : undefined,
    isAvailable: filters.isAvailable === false ? 'false' : undefined,
    isFeatured: filters.isFeatured ? 'true' : undefined,
    minRating: filters.minRating != null ? String(filters.minRating) : undefined,
    sortBy: filters.sortBy !== DEFAULTS.sortBy ? filters.sortBy : undefined,
    search: filters.search,
    page: filters.page && filters.page !== 1 ? String(filters.page) : undefined,
    limit: filters.limit && filters.limit !== 9 ? String(filters.limit) : undefined,
    view: filters.view !== 'grid' ? filters.view : undefined,
  };
}

export function countActiveFilters(filters: FiltersState): number {
  let n = 0;
  if (filters.minPrice != null || filters.maxPrice != null) n++;
  if (filters.bedType?.length) n++;
  if (filters.viewType?.length) n++;
  if (filters.amenities?.length) n++;
  if (filters.maxGuests != null && filters.maxGuests > 1) n++;
  if (filters.minRating != null) n++;
  if (filters.isFeatured) n++;
  if (filters.isAvailable === false) n++;
  return n;
}

export function useRoomFilters() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const filters = useMemo(() => parseFiltersFromSearch(search as Record<string, unknown>), [search]);

  const setFilters = useCallback(
    (patch: Partial<FiltersState>, resetPage = true) => {
      const next = { ...filters, ...patch };
      if (resetPage && !('page' in patch)) next.page = 1;
      navigate({ search: filtersToSearchParams(next), replace: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [filters, navigate]
  );

  const clearFilters = useCallback(() => {
    navigate({ search: {}, replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return { filters, setFilters, clearFilters, activeFilterCount };
}
