import type { Request, Response, NextFunction } from 'express';
import { BookingStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { parseDate, serializeDecimal } from './roomController.js';

const GST_RATE = 0.18;

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, specialRequests, numGuests } =
      req.body;

    const inDate = parseDate(checkIn);
    const outDate = parseDate(checkOut);

    if (inDate >= outDate) {
      throw new AppError(400, 'Check-out must be after check-in', 'INVALID_DATES');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inDate < today) {
      throw new AppError(400, 'Check-in cannot be in the past', 'INVALID_DATES');
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError(404, 'Room not found', 'ROOM_NOT_FOUND');
    if (!room.isAvailable) {
      throw new AppError(409, 'Room is not available', 'ROOM_UNAVAILABLE');
    }
    if (numGuests > room.maxGuests) {
      throw new AppError(400, `Room accommodates up to ${room.maxGuests} guests`, 'CAPACITY_EXCEEDED');
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { notIn: [BookingStatus.CANCELLED] },
        checkIn: { lt: outDate },
        checkOut: { gt: inDate },
      },
    });

    if (conflict) {
      throw new AppError(409, 'Room is not available for selected dates', 'DATE_CONFLICT');
    }

    const totalNights = Math.ceil((outDate.getTime() - inDate.getTime()) / 86400000);
    const subtotal = Number(room.pricePerNight) * totalNights;
    const totalAmount = subtotal * (1 + GST_RATE);

    const booking = await prisma.booking.create({
      data: {
        roomId,
        guestName,
        guestEmail,
        guestPhone: guestPhone ?? null,
        checkIn: inDate,
        checkOut: outDate,
        totalNights,
        totalAmount,
        specialReq: specialRequests ?? null,
        status: BookingStatus.PENDING,
      },
      include: {
        room: { select: { name: true, slug: true } },
      },
    });

    res.status(201).json({
      id: booking.id,
      confirmationId: booking.id.slice(0, 8).toUpperCase(),
      roomId: booking.roomId,
      roomName: booking.room.name,
      roomSlug: booking.room.slug,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      totalNights: booking.totalNights,
      totalAmount: serializeDecimal(booking.totalAmount),
      status: booking.status,
      specialRequests: booking.specialReq,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}
