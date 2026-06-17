import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '@/api/roomsApi';

export function useRoomDetail(slug: string) {
  return useQuery({
    queryKey: ['room', slug],
    queryFn: () => roomsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useBookedDates(roomId: string, enabled = true) {
  return useQuery({
    queryKey: ['room-booked-dates', roomId],
    queryFn: () => roomsApi.bookedDates(roomId),
    enabled: !!roomId && enabled,
    staleTime: 60_000,
  });
}
