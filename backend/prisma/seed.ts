import { PrismaClient, RoomCategory } from '@prisma/client';

const prisma = new PrismaClient();

const AMENITIES = [
  { name: 'Free WiFi', icon: 'Wifi' },
  { name: 'Air Conditioning', icon: 'AirVent' },
  { name: 'Mountain View', icon: 'Mountain' },
  { name: 'Fireplace', icon: 'Flame' },
  { name: 'Room Service', icon: 'ConciergeBell' },
  { name: 'Mini Bar', icon: 'Wine' },
  { name: 'Flat-screen TV', icon: 'Tv' },
  { name: 'En-suite Bathroom', icon: 'Bath' },
  { name: 'Bathtub', icon: 'Bath' },
  { name: 'Balcony', icon: 'DoorOpen' },
  { name: 'Breakfast Included', icon: 'Coffee' },
  { name: 'Parking', icon: 'Car' },
  { name: 'Swimming Pool Access', icon: 'Waves' },
  { name: 'Spa Access', icon: 'Sparkles' },
  { name: 'Laundry Service', icon: 'Shirt' },
] as const;

type RoomSeed = {
  name: string;
  slug: string;
  category: RoomCategory;
  description: string;
  shortDesc: string;
  pricePerNight: number;
  originalPrice?: number;
  maxGuests: number;
  bedType: string;
  bedCount: number;
  roomSize: number;
  floor?: number;
  viewType?: string;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  imageIndex: number;
  amenityNames: string[];
};

const ROOMS: RoomSeed[] = [
  {
    name: 'Garden View Room',
    slug: 'garden-view-room',
    category: 'GENERAL',
    description:
      'A peaceful retreat overlooking our landscaped gardens. Warm wooden accents, soft lighting, and a quiet atmosphere make this ideal for solo travelers or couples seeking rest after a day exploring Attibele.',
    shortDesc: 'Peaceful garden-facing room with warm lodge interiors and essential comforts.',
    pricePerNight: 4500,
    originalPrice: 5200,
    maxGuests: 2,
    bedType: 'Queen',
    bedCount: 1,
    roomSize: 220,
    floor: 1,
    viewType: 'Garden',
    rating: 4.3,
    reviewCount: 28,
    imageIndex: 1,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'En-suite Bathroom', 'Breakfast Included', 'Parking'],
  },
  {
    name: 'Forest Retreat',
    slug: 'forest-retreat',
    category: 'GENERAL',
    description:
      'Nestled with views toward the tree line, the Forest Retreat offers a cozy cabin feel with modern amenities. Perfect for nature lovers who want comfort without sacrificing the lodge experience.',
    shortDesc: 'Cozy forest-facing room with cabin warmth and modern essentials.',
    pricePerNight: 5200,
    maxGuests: 2,
    bedType: 'Double',
    bedCount: 1,
    roomSize: 240,
    floor: 1,
    viewType: 'Forest',
    rating: 4.5,
    reviewCount: 34,
    imageIndex: 2,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Mountain View', 'Flat-screen TV', 'En-suite Bathroom', 'Parking'],
  },
  {
    name: 'Hillside Room',
    slug: 'hillside-room',
    category: 'GENERAL',
    description:
      'Elevated views of the surrounding hills greet you each morning. This well-appointed room balances affordability with thoughtful touches like premium bedding and a reading nook by the window.',
    shortDesc: 'Hillside views with premium bedding and a quiet reading nook.',
    pricePerNight: 6000,
    originalPrice: 6800,
    maxGuests: 3,
    bedType: 'Twin',
    bedCount: 2,
    roomSize: 260,
    floor: 2,
    viewType: 'Mountain',
    isFeatured: true,
    rating: 4.6,
    reviewCount: 41,
    imageIndex: 3,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Mountain View', 'Flat-screen TV', 'En-suite Bathroom', 'Balcony', 'Parking'],
  },
  {
    name: 'Lakeside Standard',
    slug: 'lakeside-standard',
    category: 'STANDARD',
    description:
      'Our Lakeside Standard combines generous space with serene water views. Enjoy a comfortable seating area, upgraded bathroom fixtures, and easy access to lodge dining and pool facilities.',
    shortDesc: 'Spacious standard room with serene lakeside views and seating area.',
    pricePerNight: 7000,
    maxGuests: 2,
    bedType: 'Queen',
    bedCount: 1,
    roomSize: 300,
    floor: 2,
    viewType: 'Lake',
    rating: 4.4,
    reviewCount: 52,
    imageIndex: 4,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'En-suite Bathroom', 'Room Service', 'Swimming Pool Access', 'Parking'],
  },
  {
    name: 'Meadow Standard',
    slug: 'meadow-standard',
    category: 'STANDARD',
    description:
      'Open meadow vistas and abundant natural light define this inviting standard room. Ideal for couples or business travelers who appreciate a calm, uncluttered space with lodge character.',
    shortDesc: 'Bright meadow-view standard with natural light and lodge character.',
    pricePerNight: 8200,
    originalPrice: 9000,
    maxGuests: 2,
    bedType: 'King',
    bedCount: 1,
    roomSize: 320,
    floor: 2,
    viewType: 'Garden',
    rating: 4.7,
    reviewCount: 38,
    imageIndex: 5,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'En-suite Bathroom', 'Breakfast Included', 'Laundry Service', 'Parking'],
  },
  {
    name: 'Creek Standard',
    slug: 'creek-standard',
    category: 'STANDARD',
    description:
      'Listen to the gentle sounds of the nearby creek from your private balcony. This standard room features refined furnishings, a work desk, and all the comforts expected of a premium lodge stay.',
    shortDesc: 'Balcony standard near the creek with refined furnishings and work desk.',
    pricePerNight: 9500,
    maxGuests: 3,
    bedType: 'Queen',
    bedCount: 1,
    roomSize: 340,
    floor: 3,
    viewType: 'Forest',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 47,
    imageIndex: 6,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Balcony', 'Flat-screen TV', 'En-suite Bathroom', 'Room Service', 'Swimming Pool Access'],
  },
  {
    name: 'Sunrise Deluxe',
    slug: 'sunrise-deluxe',
    category: 'DELUXE',
    description:
      'Wake to golden sunrise over the mountains from your deluxe suite. Features include a fireplace, mini bar, spa-inspired bathroom with bathtub, and priority room service throughout your stay.',
    shortDesc: 'Sunrise mountain views with fireplace, mini bar, and spa bath.',
    pricePerNight: 11000,
    originalPrice: 12500,
    maxGuests: 2,
    bedType: 'King',
    bedCount: 1,
    roomSize: 400,
    floor: 3,
    viewType: 'Mountain',
    rating: 4.9,
    reviewCount: 63,
    imageIndex: 7,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Mountain View', 'Fireplace', 'Mini Bar', 'Bathtub', 'Room Service', 'Spa Access'],
  },
  {
    name: 'Panorama Deluxe',
    slug: 'panorama-deluxe',
    category: 'DELUXE',
    description:
      'Floor-to-ceiling windows frame sweeping panoramic views. This deluxe room offers a separate lounge area, premium linens, and exclusive access to lodge spa facilities for the ultimate relaxation.',
    shortDesc: 'Panoramic views with lounge area, premium linens, and spa access.',
    pricePerNight: 13500,
    maxGuests: 2,
    bedType: 'King',
    bedCount: 1,
    roomSize: 420,
    floor: 4,
    viewType: 'Mountain',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 71,
    imageIndex: 8,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Mountain View', 'Mini Bar', 'Flat-screen TV', 'Bathtub', 'Balcony', 'Spa Access', 'Breakfast Included'],
  },
  {
    name: 'Heritage Deluxe',
    slug: 'heritage-deluxe',
    category: 'DELUXE',
    description:
      'Heritage-inspired décor meets contemporary luxury in our finest deluxe offering. Handcrafted furniture, a stone fireplace, and a spacious bathroom with rain shower create an unforgettable stay.',
    shortDesc: 'Heritage décor with stone fireplace, rain shower, and handcrafted furniture.',
    pricePerNight: 15000,
    originalPrice: 17000,
    maxGuests: 3,
    bedType: 'King',
    bedCount: 1,
    roomSize: 450,
    floor: 4,
    viewType: 'Garden',
    rating: 4.8,
    reviewCount: 55,
    imageIndex: 9,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Fireplace', 'Mini Bar', 'En-suite Bathroom', 'Bathtub', 'Room Service', 'Laundry Service', 'Parking'],
  },
  {
    name: 'Royal Family Suite',
    slug: 'royal-family-suite',
    category: 'FAMILY_SUITE',
    description:
      'Our flagship family suite spans two connected spaces with a master bedroom and kids\' alcove. Pool views, a full dining nook, and dedicated concierge service make family holidays effortless.',
    shortDesc: 'Two-room family suite with pool views, dining nook, and concierge.',
    pricePerNight: 18000,
    maxGuests: 6,
    bedType: 'King',
    bedCount: 2,
    roomSize: 650,
    floor: 2,
    viewType: 'Pool',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 29,
    imageIndex: 10,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Room Service', 'Swimming Pool Access', 'Breakfast Included', 'Parking', 'Laundry Service'],
  },
  {
    name: 'Woodland Family Suite',
    slug: 'woodland-family-suite',
    category: 'FAMILY_SUITE',
    description:
      'Surrounded by woodland views, this suite offers separate sleeping and living zones for families. A kitchenette, two bathrooms, and direct garden access ensure everyone has space to unwind.',
    shortDesc: 'Woodland suite with kitchenette, two bathrooms, and garden access.',
    pricePerNight: 22000,
    originalPrice: 25000,
    maxGuests: 5,
    bedType: 'Queen',
    bedCount: 2,
    roomSize: 580,
    floor: 1,
    viewType: 'Forest',
    rating: 4.7,
    reviewCount: 22,
    imageIndex: 11,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Mountain View', 'Fireplace', 'Flat-screen TV', 'En-suite Bathroom', 'Breakfast Included', 'Parking'],
  },
  {
    name: 'Lodge Grand Suite',
    slug: 'lodge-grand-suite',
    category: 'FAMILY_SUITE',
    description:
      'The pinnacle of lodge hospitality — a grand suite with panoramic mountain views, private balcony, fireplace, spa bathtub, and butler-style room service. Perfect for celebrations and extended stays.',
    shortDesc: 'Grand suite with panoramic views, private balcony, and butler service.',
    pricePerNight: 25000,
    maxGuests: 8,
    bedType: 'King',
    bedCount: 2,
    roomSize: 780,
    floor: 5,
    viewType: 'Mountain',
    isFeatured: true,
    rating: 5.0,
    reviewCount: 18,
    imageIndex: 12,
    amenityNames: ['Free WiFi', 'Air Conditioning', 'Mountain View', 'Fireplace', 'Mini Bar', 'Bathtub', 'Balcony', 'Room Service', 'Spa Access', 'Swimming Pool Access', 'Breakfast Included', 'Parking', 'Laundry Service'],
  },
];

const SAMPLE_REVIEWS = [
  { guestName: 'Priya Sharma', rating: 5, comment: 'Absolutely wonderful stay. The room was spotless and the staff went above and beyond.', daysAgo: 14 },
  { guestName: 'Rajesh Kumar', rating: 4, comment: 'Great location and comfortable beds. Would definitely return for a weekend getaway.', daysAgo: 30 },
  { guestName: 'Ananya Reddy', rating: 5, comment: 'The views from our room were breathtaking. Breakfast was delicious too!', daysAgo: 45 },
  { guestName: 'Vikram Patel', rating: 4, comment: 'Clean, quiet, and well-maintained. Perfect for a business trip near Sarjapur Road.', daysAgo: 60 },
  { guestName: 'Meera Iyer', rating: 5, comment: 'Loved the lodge atmosphere. Felt like a true mountain retreat despite being in Bengaluru.', daysAgo: 90 },
];

async function main() {
  console.log('🌱 Seeding rooms system...');

  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.roomAmenity.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.room.deleteMany();
  await prisma.amenity.deleteMany();

  const amenityRecords = await Promise.all(
    AMENITIES.map((a) => prisma.amenity.create({ data: a }))
  );
  const amenityMap = Object.fromEntries(amenityRecords.map((a) => [a.name, a.id]));

  for (const room of ROOMS) {
    const imageUrl = `/images/rooms/room-${room.imageIndex}.jpg`;
    const created = await prisma.room.create({
      data: {
        name: room.name,
        slug: room.slug,
        category: room.category,
        description: room.description,
        shortDesc: room.shortDesc,
        pricePerNight: room.pricePerNight,
        originalPrice: room.originalPrice,
        maxGuests: room.maxGuests,
        bedType: room.bedType,
        bedCount: room.bedCount,
        roomSize: room.roomSize,
        floor: room.floor,
        viewType: room.viewType,
        isFeatured: room.isFeatured ?? false,
        rating: room.rating ?? 0,
        reviewCount: room.reviewCount ?? 0,
        images: {
          create: [
            { url: imageUrl, altText: room.name, isPrimary: true, order: 0 },
            { url: imageUrl, altText: `${room.name} interior`, isPrimary: false, order: 1 },
          ],
        },
        amenities: {
          create: room.amenityNames.map((name) => ({
            amenityId: amenityMap[name],
          })),
        },
        reviews: {
          create: SAMPLE_REVIEWS.slice(0, 3).map((r, i) => ({
            guestName: r.guestName,
            rating: r.rating,
            comment: r.comment,
            stayDate: new Date(Date.now() - (r.daysAgo + i * 5) * 86400000),
            isVerified: true,
          })),
        },
      },
    });
    console.log(`  ✓ ${created.name}`);
  }

  console.log(`✅ Seeded ${ROOMS.length} rooms, ${AMENITIES.length} amenities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
