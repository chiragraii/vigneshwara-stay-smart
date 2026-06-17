import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useState, useMemo } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategoryTabs } from '@/components/rooms/CategoryTabs';
import { FilterSidebar } from '@/components/rooms/FilterSidebar';
import { RoomsToolbar } from '@/components/rooms/RoomsToolbar';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomCardList } from '@/components/rooms/RoomCardList';
import { RoomsGridSkeleton } from '@/components/rooms/RoomCardSkeleton';
import { BookingModal } from '@/components/rooms/BookingModal';
import { CompareTray, CompareDrawer } from '@/components/rooms/CompareDrawer';
import { useRoomFilters } from '@/hooks/useRoomFilters';
import { useRooms, useCategoriesSummary, useAmenitiesList } from '@/hooks/useRooms';
import type { Room, RoomCategory } from '@/types/room';

const roomsSearchSchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  maxGuests: z.string().optional(),
  bedType: z.string().optional(),
  viewType: z.string().optional(),
  amenities: z.string().optional(),
  isAvailable: z.string().optional(),
  isFeatured: z.string().optional(),
  minRating: z.string().optional(),
  sortBy: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  view: z.string().optional(),
});

export const Route = createFileRoute('/rooms')({
  validateSearch: roomsSearchSchema,
  head: () => ({
    meta: [
      { title: 'Rooms & Rates — Hotel Vigneshwara Lodge' },
      { name: 'description', content: 'Browse lodge rooms at Hotel Vigneshwara. Filter by category, price, amenities and book your perfect stay in Attibele, Bengaluru.' },
      { property: 'og:title', content: 'Rooms — Hotel Vigneshwara Lodge' },
      { property: 'og:description', content: 'Discover our General, Standard, Deluxe and Family Suite rooms.' },
      { property: 'og:image', content: '/images/rooms/room-1.jpg' },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  const { filters, setFilters, clearFilters, activeFilterCount } = useRoomFilters();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [bookRoom, setBookRoom] = useState<Room | null>(null);
  const [compareRooms, setCompareRooms] = useState<Room[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const apiFilters = useMemo(() => {
    const { minRating, view, ...rest } = filters;
    return rest;
  }, [filters]);

  const { data, isLoading, isError, refetch } = useRooms(apiFilters);
  const { data: summaries = [] } = useCategoriesSummary();
  const { data: amenities = [] } = useAmenitiesList();

  const rooms = useMemo(() => {
    let list = data?.data ?? [];
    if (filters.minRating) {
      list = list.filter((r) => r.rating >= filters.minRating!);
    }
    return list;
  }, [data?.data, filters.minRating]);

  const cheapestByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of rooms) {
      if (!map[r.category] || r.pricePerNight < map[r.category]) {
        map[r.category] = r.pricePerNight;
      }
    }
    return map;
  }, [rooms]);

  const featuredRoom = rooms.find((r) => r.isFeatured) ?? rooms[0];

  function toggleCompare(room: Room) {
    setCompareRooms((prev) => {
      if (prev.some((x) => x.id === room.id)) return prev.filter((x) => x.id !== room.id);
      if (prev.length >= 3) return prev;
      return [...prev, room];
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative bg-secondary/40 border-b border-border">
        <div className="container-narrow py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Stays</div>
          <h1 className="font-display text-4xl md:text-5xl max-w-2xl">Find your perfect lodge retreat</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Warm rooms, mountain views, and sincere hospitality — from cozy general rooms to grand family suites.
          </p>
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms…"
              className="pl-10 h-12 bg-background"
              defaultValue={filters.search}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setFilters({ search: (e.target as HTMLInputElement).value });
                }
              }}
            />
          </div>
        </div>
      </section>

      <CategoryTabs
        summaries={summaries}
        activeCategory={filters.category as RoomCategory | ''}
        onChange={(cat) => setFilters({ category: cat })}
      />

      <main className="flex-1 container-narrow py-8 pb-28">
        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            priceRange={data?.priceRange ?? { min: 4500, max: 25000 }}
            amenities={amenities}
            onApply={(patch) => setFilters(patch)}
            onClear={clearFilters}
            mobileOpen={mobileFilters}
            onMobileOpenChange={setMobileFilters}
          />

          <div className="flex-1 min-w-0">
            <RoomsToolbar
              total={data?.meta.total ?? 0}
              sortBy={filters.sortBy ?? 'price_asc'}
              view={filters.view ?? 'grid'}
              onSortChange={(sortBy) => setFilters({ sortBy })}
              onViewChange={(view) => setFilters({ view }, false)}
              onOpenFilters={() => setMobileFilters(true)}
              activeFilterCount={activeFilterCount}
            />

            {isLoading && <RoomsGridSkeleton count={9} list={filters.view === 'list'} />}

            {isError && (
              <div className="text-center py-20">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="mt-4 text-muted-foreground">Could not load rooms.</p>
                <Button className="mt-4" onClick={() => refetch()}>Retry</Button>
              </div>
            )}

            {!isLoading && !isError && rooms.length === 0 && (
              <div className="text-center py-20">
                <p className="font-display text-2xl">No rooms match your filters</p>
                <p className="mt-2 text-muted-foreground text-sm">Try adjusting your search or clearing filters.</p>
                <Button variant="outline" className="mt-6" onClick={clearFilters}>Clear filters</Button>
              </div>
            )}

            {!isLoading && !isError && rooms.length > 0 && (
              <>
                <div className={filters.view === 'list' ? 'space-y-4' : 'grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}>
                  {rooms.map((room) =>
                    filters.view === 'list' ? (
                      <RoomCardList
                        key={room.id}
                        room={room}
                        onBook={setBookRoom}
                        compareSelected={compareRooms.some((x) => x.id === room.id)}
                        onCompareToggle={toggleCompare}
                      />
                    ) : (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onBook={setBookRoom}
                        compareSelected={compareRooms.some((x) => x.id === room.id)}
                        onCompareToggle={toggleCompare}
                        cheapestInCategory={room.pricePerNight === cheapestByCategory[room.category]}
                      />
                    )
                  )}
                </div>

                {data && data.meta.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data.meta.hasPrevPage}
                      onClick={() => setFilters({ page: (filters.page ?? 1) - 1 }, false)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground px-3">
                      Page {data.meta.page} of {data.meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data.meta.hasNextPage}
                      onClick={() => setFilters({ page: (filters.page ?? 1) + 1 }, false)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Featured Stay */}
      {featuredRoom && (
        <section className="bg-primary text-primary-foreground">
          <div className="container-narrow py-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Featured Stay</div>
              <h2 className="font-display text-4xl">{featuredRoom.name}</h2>
              <p className="mt-3 opacity-80 text-sm leading-relaxed">{featuredRoom.shortDesc}</p>
              <Button
                className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90"
                onClick={() => setBookRoom(featuredRoom)}
              >
                Book featured room
              </Button>
            </div>
            <div className="aspect-[16/10] rounded-md overflow-hidden">
              <img
                src={featuredRoom.images?.[0]?.url ?? '/images/rooms/room-1.jpg'}
                alt={featuredRoom.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <CompareTray rooms={compareRooms} onCompare={() => setCompareOpen(true)} onRemove={(id) => setCompareRooms((p) => p.filter((r) => r.id !== id))} />
      <CompareDrawer rooms={compareRooms} open={compareOpen} onOpenChange={setCompareOpen} onRemove={(id) => setCompareRooms((p) => p.filter((r) => r.id !== id))} />
      <BookingModal room={bookRoom} open={!!bookRoom} onOpenChange={(o) => !o && setBookRoom(null)} />

      <SiteFooter />
    </div>
  );
}
