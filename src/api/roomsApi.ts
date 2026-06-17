const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '' && v !== false) {
      sp.set(k, String(v));
    }
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

import type {
  RoomsResponse,
  RoomDetail,
  CategorySummary,
  Amenity,
  AvailabilityResponse,
  BookingPayload,
  BookingResponse,
  FiltersState,
} from '@/types/room';

export function buildRoomsQuery(filters: FiltersState): string {
  return toQuery({
    category: filters.category || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    maxGuests: filters.maxGuests,
    bedType: filters.bedType?.join(','),
    viewType: filters.viewType?.join(','),
    amenities: filters.amenities?.join(','),
    isAvailable: filters.isAvailable,
    isFeatured: filters.isFeatured,
    sortBy: filters.sortBy,
    search: filters.search,
    page: filters.page,
    limit: filters.limit,
  });
}

export const roomsApi = {
  list: (filters: FiltersState) =>
    request<RoomsResponse>(`/api/rooms${buildRoomsQuery(filters)}`),

  getBySlug: (slug: string) => request<RoomDetail>(`/api/rooms/detail/${slug}`),

  categoriesSummary: () => request<CategorySummary[]>('/api/rooms/categories/summary'),

  amenities: () => request<Amenity[]>('/api/rooms/amenities'),

  checkAvailability: (body: { roomId: string; checkIn: string; checkOut: string }) =>
    request<AvailabilityResponse>('/api/rooms/check-availability', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  bookedDates: (roomId: string) =>
    request<{ dates: string[] }>(`/api/rooms/booked-dates/${roomId}`),

  createBooking: (payload: BookingPayload) =>
    request<BookingResponse>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
