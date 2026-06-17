import type { Request, Response, NextFunction } from 'express';
import { Prisma, BookingStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ListRoomsQuery } from '../schemas/roomSchemas.js';

function parseDate(input: string): Date {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) throw new AppError(400, 'Invalid date', 'INVALID_DATE');
  return d;
}

function serializeDecimal(value: Prisma.Decimal | null | undefined): number | null {
  if (value == null) return null;
  return Number(value);
}

function serializeRoom(room: {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDesc: string;
  pricePerNight: Prisma.Decimal;
  originalPrice: Prisma.Decimal | null;
  maxGuests: number;
  bedType: string;
  bedCount: number;
  roomSize: number;
  floor: number | null;
  viewType: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  images?: { id: string; url: string; altText: string | null; isPrimary: boolean; order: number }[];
  amenities?: { amenity: { id: string; name: string; icon: string } }[];
}) {
  return {
    id: room.id,
    name: room.name,
    slug: room.slug,
    category: room.category,
    description: room.description,
    shortDesc: room.shortDesc,
    pricePerNight: serializeDecimal(room.pricePerNight)!,
    originalPrice: serializeDecimal(room.originalPrice),
    maxGuests: room.maxGuests,
    bedType: room.bedType,
    bedCount: room.bedCount,
    roomSize: room.roomSize,
    floor: room.floor,
    viewType: room.viewType,
    isAvailable: room.isAvailable,
    isFeatured: room.isFeatured,
    rating: room.rating ?? 0,
    reviewCount: room.reviewCount,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
    images: room.images?.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      isPrimary: img.isPrimary,
      order: img.order,
    })),
    amenities: room.amenities?.map((ra) => ({
      id: ra.amenity.id,
      name: ra.amenity.name,
      icon: ra.amenity.icon,
    })),
  };
}

export async function listRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (req as Request & { validatedQuery: ListRoomsQuery }).validatedQuery;
    const {
      category,
      minPrice,
      maxPrice,
      maxGuests,
      bedType,
      viewType,
      amenities,
      isAvailable,
      isFeatured,
      sortBy,
      search,
      page,
      limit,
    } = query;

    const where: Prisma.RoomWhereInput = {};

    if (category) where.category = category;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (maxGuests) where.maxGuests = { gte: maxGuests };
    if (bedType) where.bedType = { in: bedType.split(',').map((b) => b.trim()) };
    if (viewType) where.viewType = { in: viewType.split(',').map((v) => v.trim()) };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerNight = {};
      if (minPrice !== undefined) where.pricePerNight.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerNight.lte = maxPrice;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (amenities) {
      const ids = amenities.split(',').map((a) => a.trim()).filter(Boolean);
      if (ids.length > 0) {
        where.AND = ids.map((id) => ({
          amenities: { some: { amenityId: id } },
        }));
      }
    }

    const orderBy: Prisma.RoomOrderByWithRelationInput[] = (() => {
      switch (sortBy) {
        case 'price_desc':
          return [{ pricePerNight: 'desc' }];
        case 'rating':
          return [{ rating: 'desc' }];
        case 'popularity':
          return [{ reviewCount: 'desc' }];
        case 'newest':
          return [{ createdAt: 'desc' }];
        default:
          return [{ pricePerNight: 'asc' }];
      }
    })();

    const skip = (page - 1) * limit;

    const [rooms, total, priceAgg] = await Promise.all([
      prisma.room.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { orderBy: { order: 'asc' } },
          amenities: { include: { amenity: true } },
        },
      }),
      prisma.room.count({ where }),
      prisma.room.aggregate({
        _min: { pricePerNight: true },
        _max: { pricePerNight: true },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: rooms.map(serializeRoom),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      priceRange: {
        min: serializeDecimal(priceAgg._min.pricePerNight) ?? 0,
        max: serializeDecimal(priceAgg._max.pricePerNight) ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRoomBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        amenities: { include: { amenity: true } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!room) throw new AppError(404, 'Room not found', 'ROOM_NOT_FOUND');

    const relatedRooms = await prisma.room.findMany({
      where: { category: room.category, id: { not: room.id }, isAvailable: true },
      take: 3,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        amenities: { include: { amenity: true }, take: 5 },
      },
    });

    const avgRating =
      room.reviews.length > 0
        ? room.reviews.reduce((s, r) => s + r.rating, 0) / room.reviews.length
        : room.rating ?? 0;

    res.json({
      ...serializeRoom(room),
      reviews: room.reviews.map((r) => ({
        id: r.id,
        guestName: r.guestName,
        rating: r.rating,
        comment: r.comment,
        stayDate: r.stayDate.toISOString(),
        isVerified: r.isVerified,
        createdAt: r.createdAt.toISOString(),
      })),
      avgRating,
      relatedRooms: relatedRooms.map(serializeRoom),
      availability: room.isAvailable,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategoriesSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = ['GENERAL', 'STANDARD', 'DELUXE', 'FAMILY_SUITE'] as const;

    const summaries = await Promise.all(
      categories.map(async (category) => {
        const [count, minPrice, featured] = await Promise.all([
          prisma.room.count({ where: { category, isAvailable: true } }),
          prisma.room.aggregate({
            where: { category, isAvailable: true },
            _min: { pricePerNight: true },
          }),
          prisma.room.findFirst({
            where: { category, isAvailable: true },
            include: { images: { where: { isPrimary: true }, take: 1 } },
            orderBy: { isFeatured: 'desc' },
          }),
        ]);

        return {
          category,
          count,
          startingFrom: serializeDecimal(minPrice._min.pricePerNight) ?? 0,
          image: featured?.images[0]?.url ?? null,
        };
      })
    );

    res.json(summaries);
  } catch (err) {
    next(err);
  }
}

export async function listAmenities(_req: Request, res: Response, next: NextFunction) {
  try {
    const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } });
    res.json(amenities);
  } catch (err) {
    next(err);
  }
}

export async function checkAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const inDate = parseDate(checkIn);
    const outDate = parseDate(checkOut);

    if (inDate >= outDate) {
      throw new AppError(400, 'Check-out must be after check-in', 'INVALID_DATES');
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError(404, 'Room not found', 'ROOM_NOT_FOUND');
    if (!room.isAvailable) {
      res.json({ available: false, conflictingDates: [] });
      return;
    }

    const conflicts = await prisma.booking.findMany({
      where: {
        roomId,
        status: { notIn: [BookingStatus.CANCELLED] },
        checkIn: { lt: outDate },
        checkOut: { gt: inDate },
      },
      select: { checkIn: true, checkOut: true },
    });

    if (conflicts.length === 0) {
      res.json({ available: true });
      return;
    }

    const conflictingDates = conflicts.flatMap((b) => [
      b.checkIn.toISOString().slice(0, 10),
      b.checkOut.toISOString().slice(0, 10),
    ]);

    res.json({ available: false, conflictingDates: [...new Set(conflictingDates)] });
  } catch (err) {
    next(err);
  }
}

export async function getRoomBookedDates(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { notIn: [BookingStatus.CANCELLED] },
        checkOut: { gte: new Date() },
      },
      select: { checkIn: true, checkOut: true },
    });

    const dates: string[] = [];
    for (const b of bookings) {
      const cur = new Date(b.checkIn);
      while (cur < b.checkOut) {
        dates.push(cur.toISOString().slice(0, 10));
        cur.setDate(cur.getDate() + 1);
      }
    }

    res.json({ dates: [...new Set(dates)] });
  } catch (err) {
    next(err);
  }
}

export { parseDate, serializeDecimal };
