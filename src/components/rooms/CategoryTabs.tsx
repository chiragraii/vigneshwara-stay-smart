import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/formatters';
import type { CategorySummary, RoomCategory } from '@/types/room';
import { CATEGORY_LABELS, RoomCategory as RC } from '@/types/room';

interface CategoryTabsProps {
  summaries: CategorySummary[];
  activeCategory: RoomCategory | '';
  onChange: (category: RoomCategory | '') => void;
}

const TAB_ORDER: (RoomCategory | '')[] = ['', RC.GENERAL, RC.STANDARD, RC.DELUXE, RC.FAMILY_SUITE];

export function CategoryTabs({ summaries, activeCategory, onChange }: CategoryTabsProps) {
  const summaryMap = Object.fromEntries(summaries.map((s) => [s.category, s]));

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border -mx-[max(1rem,calc((100vw-1200px)/2+1rem))] px-[max(1rem,calc((100vw-1200px)/2+1rem))]">
      <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TAB_ORDER.map((cat) => {
          const label = cat === '' ? 'All' : CATEGORY_LABELS[cat];
          const summary = cat ? summaryMap[cat] : null;
          const count = cat === '' ? summaries.reduce((s, x) => s + x.count, 0) : summary?.count ?? 0;
          const from = cat === '' ? Math.min(...summaries.map((s) => s.startingFrom).filter(Boolean)) : summary?.startingFrom;
          const active = activeCategory === cat;

          return (
            <button
              key={cat || 'all'}
              type="button"
              onClick={() => onChange(cat)}
              className={cn(
                'shrink-0 flex flex-col items-start px-4 py-2 rounded-full border transition-colors text-left',
                active
                  ? 'bg-gold/15 border-gold text-foreground'
                  : 'border-border bg-card hover:border-gold/50 text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                {label}
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', active ? 'bg-gold text-gold-foreground' : 'bg-secondary')}>
                  {count}
                </span>
              </span>
              {from != null && from > 0 && (
                <span className="text-[10px] mt-0.5 opacity-80">from {formatPrice(from)}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
