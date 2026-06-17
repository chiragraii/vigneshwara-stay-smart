import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '@/api/roomsApi';
import type { FiltersState } from '@/types/room';

export function useRooms(filters: FiltersState) {
  return useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => roomsApi.list(filters),
    staleTime: 30_000,
  });
}

export function useCategoriesSummary() {
  return useQuery({
    queryKey: ['rooms', 'categories-summary'],
    queryFn: () => roomsApi.categoriesSummary(),
    staleTime: 60_000,
  });
}

export function useAmenitiesList() {
  return useQuery({
    queryKey: ['rooms', 'amenities'],
    queryFn: () => roomsApi.amenities(),
    staleTime: 120_000,
  });
}
