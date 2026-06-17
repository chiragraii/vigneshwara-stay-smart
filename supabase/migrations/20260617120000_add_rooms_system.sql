-- Rooms system migration (replaces legacy rooms/bookings tables)

-- Drop legacy tables if they exist
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.room_status CASCADE;

-- Enums
CREATE TYPE public."RoomCategory" AS ENUM ('GENERAL', 'DELUXE', 'STANDARD', 'FAMILY_SUITE');
CREATE TYPE public."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'CHECKED_OUT');

-- Rooms
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category public."RoomCategory" NOT NULL,
  description TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  price_per_night NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  max_guests INTEGER NOT NULL,
  bed_type TEXT NOT NULL,
  bed_count INTEGER NOT NULL DEFAULT 1,
  room_size INTEGER NOT NULL,
  floor INTEGER,
  view_type TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  rating DOUBLE PRECISION DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.room_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL
);

CREATE TABLE public.room_amenities (
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES public.amenities(id),
  PRIMARY KEY (room_id, amenity_id)
);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ NOT NULL,
  total_nights INTEGER NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status public."BookingStatus" NOT NULL DEFAULT 'PENDING',
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id),
  guest_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  stay_date TIMESTAMPTZ NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_rooms_category ON public.rooms(category);
CREATE INDEX idx_rooms_slug ON public.rooms(slug);
CREATE INDEX idx_rooms_price ON public.rooms(price_per_night);
CREATE INDEX idx_bookings_room_dates ON public.bookings(room_id, check_in, check_out);
CREATE INDEX idx_reviews_room ON public.reviews(room_id);

-- RLS (public read for rooms, bookings insert for anon)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT SELECT ON public.room_images TO anon, authenticated;
GRANT SELECT ON public.amenities TO anon, authenticated;
GRANT SELECT ON public.room_amenities TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT SELECT, INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view room images" ON public.room_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view amenities" ON public.amenities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view room amenities" ON public.room_amenities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT TO anon, authenticated USING (true);

-- Updated_at trigger for rooms
CREATE OR REPLACE FUNCTION public.set_rooms_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.set_rooms_updated_at();
