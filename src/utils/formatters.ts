export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPriceShort(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return formatPrice(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
}

export function calcTotalWithGst(pricePerNight: number, nights: number, gstRate = 0.18): number {
  const subtotal = pricePerNight * nights;
  return Math.round(subtotal * (1 + gstRate));
}

export function isOnSale(price: number, originalPrice: number | null): boolean {
  if (!originalPrice || originalPrice <= price) return false;
  return (originalPrice - price) / originalPrice >= 0.1;
}

export function categoryLabel(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
