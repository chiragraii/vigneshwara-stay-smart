import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { CollapsibleSection } from './RoomsToolbar';
import { formatPrice } from '@/utils/formatters';
import { CATEGORY_LABELS, RoomCategory, type Amenity, type FiltersState } from '@/types/room';
import { getAmenityIcon } from './amenityIcons';

const BED_TYPES = ['King', 'Queen', 'Twin', 'Double'];
const VIEW_TYPES = ['Mountain', 'Garden', 'Pool', 'Forest', 'Lake'];

interface FilterSidebarProps {
  filters: FiltersState;
  priceRange: { min: number; max: number };
  amenities: Amenity[];
  onApply: (patch: Partial<FiltersState>) => void;
  onClear: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

function FilterContent({
  filters,
  priceRange,
  amenities,
  draft,
  setDraft,
}: {
  filters: FiltersState;
  priceRange: { min: number; max: number };
  amenities: Amenity[];
  draft: Partial<FiltersState>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<FiltersState>>>;
}) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const minP = draft.minPrice ?? priceRange.min;
  const maxP = draft.maxPrice ?? priceRange.max;
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);

  function toggleArray(key: 'bedType' | 'viewType' | 'amenities', value: string) {
    setDraft((d) => {
      const arr = (d[key] as string[] | undefined) ?? (filters[key] as string[] | undefined) ?? [];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...d, [key]: next.length ? next : undefined };
    });
  }

  function toggleCategory(cat: RoomCategory) {
    setDraft((d) => {
      const current = filters.category;
      return { ...d, category: current === cat ? '' : cat };
    });
  }

  return (
    <div className="space-y-0">
      <CollapsibleSection title="Price Range">
        <Slider
          min={priceRange.min}
          max={priceRange.max}
          step={500}
          value={[minP, maxP]}
          onValueChange={([a, b]) => setDraft((d) => ({ ...d, minPrice: a, maxPrice: b }))}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatPrice(minP)}</span>
          <span>{formatPrice(maxP)}</span>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Category">
        <div className="space-y-2">
          {(Object.keys(CATEGORY_LABELS) as RoomCategory[]).map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={filters.category === cat || draft.category === cat}
                onCheckedChange={() => toggleCategory(cat)}
              />
              {CATEGORY_LABELS[cat]}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Bed Type">
        <div className="space-y-2">
          {BED_TYPES.map((bed) => (
            <label key={bed} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={(draft.bedType ?? filters.bedType ?? []).includes(bed)}
                onCheckedChange={() => toggleArray('bedType', bed)}
              />
              {bed}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Guests">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                maxGuests: Math.max(1, (d.maxGuests ?? filters.maxGuests ?? 1) - 1),
              }))
            }
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm w-8 text-center">{draft.maxGuests ?? filters.maxGuests ?? 1}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                maxGuests: Math.min(8, (d.maxGuests ?? filters.maxGuests ?? 1) + 1),
              }))
            }
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="View Type">
        <div className="space-y-2">
          {VIEW_TYPES.map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={(draft.viewType ?? filters.viewType ?? []).includes(v)}
                onCheckedChange={() => toggleArray('viewType', v)}
              />
              {v}
            </label>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Amenities">
        <div className="grid grid-cols-2 gap-2">
          {visibleAmenities.map((a) => {
            const Icon = getAmenityIcon(a.icon);
            return (
              <label key={a.id} className="flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox
                  checked={(draft.amenities ?? filters.amenities ?? []).includes(a.id)}
                  onCheckedChange={() => toggleArray('amenities', a.id)}
                />
                <Icon className="h-3 w-3 shrink-0" />
                <span className="truncate">{a.name}</span>
              </label>
            );
          })}
        </div>
        {amenities.length > 8 && (
          <button type="button" className="text-xs text-gold mt-2 hover:underline" onClick={() => setShowAllAmenities(!showAllAmenities)}>
            {showAllAmenities ? 'Show less' : 'Show more'}
          </button>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Availability">
        <div className="flex items-center justify-between">
          <Label htmlFor="avail-only" className="text-sm">Available only</Label>
          <Switch
            id="avail-only"
            checked={(draft.isAvailable ?? filters.isAvailable) !== false}
            onCheckedChange={(c) => setDraft((d) => ({ ...d, isAvailable: c }))}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Rating">
        <div className="space-y-2">
          {[
            { label: '4★ & above', value: 4 },
            { label: '3★ & above', value: 3 },
            { label: 'Any rating', value: 0 },
          ].map((r) => (
            <label key={r.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={(draft.minRating ?? filters.minRating ?? 0) === r.value}
                onChange={() => setDraft((d) => ({ ...d, minRating: r.value || undefined }))}
              />
              {r.label}
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export function FilterSidebar({
  filters,
  priceRange,
  amenities,
  onApply,
  onClear,
  mobileOpen,
  onMobileOpenChange,
}: FilterSidebarProps) {
  const [draft, setDraft] = useState<Partial<FiltersState>>({});

  useEffect(() => {
    setDraft({});
  }, [filters]);

  function apply() {
    onApply(draft);
    onMobileOpenChange?.(false);
  }

  const sidebarInner = (
    <>
      <FilterContent
        filters={filters}
        priceRange={priceRange}
        amenities={amenities}
        draft={draft}
        setDraft={setDraft}
      />
      <div className="pt-4 space-y-2 sticky bottom-0 bg-card">
        <Button className="w-full" onClick={apply}>Apply Filters</Button>
        <button type="button" onClick={onClear} className="w-full text-sm text-muted-foreground hover:text-gold">
          Clear All
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-36 bg-card border border-border rounded-md p-5 shadow-card max-h-[calc(100vh-10rem)] overflow-y-auto">
          <h2 className="font-display text-lg mb-2">Filters</h2>
          {sidebarInner}
        </div>
      </aside>

      <Drawer open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="font-display">Filters</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto flex-1">{sidebarInner}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
