import { z } from 'zod';

export const roomCategoryEnum = z.enum(['GENERAL', 'DELUXE', 'STANDARD', 'FAMILY_SUITE']);
export const sortByEnum = z.enum(['price_asc', 'price_desc', 'rating', 'popularity', 'newest']);

export const listRoomsQuerySchema = z.object({
  category: roomCategoryEnum.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  maxGuests: z.coerce.number().int().min(1).optional(),
  bedType: z.string().optional(),
  viewType: z.string().optional(),
  amenities: z.string().optional(),
  isAvailable: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? true : v === 'true')),
  isFeatured: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  sortBy: sortByEnum.optional().default('price_asc'),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(9),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const checkAvailabilitySchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  checkOut: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

export const createBookingSchema = z.object({
  roomId: z.string().uuid(),
  guestName: z.string().trim().min(2).max(120),
  guestEmail: z.string().email().max(255),
  guestPhone: z.string().trim().min(7).max(20).optional(),
  checkIn: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  checkOut: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  specialRequests: z.string().max(500).optional(),
  numGuests: z.coerce.number().int().min(1).max(10).optional().default(1),
});

export type ListRoomsQuery = z.infer<typeof listRoomsQuerySchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
