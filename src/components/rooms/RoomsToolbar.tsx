import { useState } from 'react';
import { ChevronDown, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortBy } from '@/types/room';

interface RoomsToolbarProps {
  total: number;
  sortBy: SortBy;
  view: 'grid' | 'list';
  onSortChange: (sort: SortBy) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
}

export function RoomsToolbar({
  total,
  sortBy,
  view,
  onSortChange,
  onViewChange,
  onOpenFilters,
  activeFilterCount = 0,
}: RoomsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        {onOpenFilters && (
          <Button variant="outline" size="sm" className="lg:hidden gap-2" onClick={onOpenFilters}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-gold text-gold-foreground text-[10px] px-1.5 rounded-full">{activeFilterCount}</span>
            )}
          </Button>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{total}</span> room{total !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortBy)}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden sm:flex border border-border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            className={`p-2 ${view === 'grid' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={`p-2 ${view === 'list' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-medium"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
