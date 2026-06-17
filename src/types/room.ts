export enum RoomCategory {
  GENERAL = 'GENERAL',
  DELUXE = 'DELUXE',
  STANDARD = 'STANDARD',
  FAMILY_SUITE = 'FAMILY_SUITE',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
}

export interface RoomImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  order: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  category: RoomCategory;
  description: string;
  shortDesc: string;
  pricePerNight: number;
  originalPrice: number | null;
  maxGuests: number;
  bedType: string;
  bedCount: number;
  roomSize: number;
  floor: number | null;
  viewType: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  images?: RoomImage[];
  amenities?: Amenity[];
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  stayDate: string;
  isVerified: boolean;
  createdAt: string;
}

export interface RoomDetail extends Room {
  reviews: Review[];
  avgRating: number;
  relatedRooms: Room[];
  availability: boolean;
}

export interface CategorySummary {
  category: RoomCategory;
  count: number;
  startingFrom: number;
  image: string | null;
}

export interface RoomsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RoomsResponse {
  data: Room[];
  meta: RoomsMeta;
  priceRange: { min: number; max: number };
}

export type SortBy = 'price_asc' | 'price_desc' | 'rating' | 'popularity' | 'newest';

export interface FiltersState {
  category?: RoomCategory | '';
  minPrice?: number;
  maxPrice?: number;
  maxGuests?: number;
  bedType?: string[];
  viewType?: string[];
  amenities?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  minRating?: number;
  sortBy?: SortBy;
  search?: string;
  page?: number;
  limit?: number;
  view?: 'grid' | 'list';
}

export interface BookingPayload {
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  specialRequests?: string;
  numGuests?: number;
}

export interface BookingResponse {
  id: string;
  confirmationId: string;
  roomId: string;
  roomName: string;
  roomSlug: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests: string | null;
  createdAt: string;
}

export interface AvailabilityResponse {
  available: boolean;
  conflictingDates?: string[];
}

export const CATEGORY_LABELS: Record<RoomCategory, string> = {
  [RoomCategory.GENERAL]: 'General',
  [RoomCategory.STANDARD]: 'Standard',
  [RoomCategory.DELUXE]: 'Deluxe',
  [RoomCategory.FAMILY_SUITE]: 'Family Suite',
};

export const CATEGORY_COLORS: Record<RoomCategory, string> = {
  [RoomCategory.GENERAL]: 'bg-secondary text-secondary-foreground',
  [RoomCategory.STANDARD]: 'bg-primary/10 text-primary',
  [RoomCategory.DELUXE]: 'bg-gold/20 text-gold-foreground',
  [RoomCategory.FAMILY_SUITE]: 'bg-primary text-primary-foreground',
};
