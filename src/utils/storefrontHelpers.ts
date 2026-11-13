export interface StoreProduct {
  id: string;
  handle: string;
  title: string;
  category: string;
  collectionHandle: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  quoteOnly: boolean;
  images: string[];
  isCutout?: boolean;
  variants: string[];
  description: string;
  dimensions: string;
  materials: string;
  features: string[];
}

export interface CartItem {
  productId: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface QuoteFormInput {
  name: string;
  phone: string;
  email: string;
  institution: string;
  productName: string;
  quantity: string;
  location: string;
  requirements: string;
}

export const SCHOOL_DECOR_CONTACT = {
  name: 'Manish Gupta',
  phoneDisplay: '+91 93122 54660',
  telHref: 'tel:+919312254660',
  whatsappNumber: '919312254660',
  email: 'schooldecor1@gmail.com',
} as const;

export function buildWhatsAppUrl(
  phoneDigits: string,
  productName?: string,
  productUrl?: string
): string {
  const cleanPhone = phoneDigits.replace(/[^\d]/g, '') || SCHOOL_DECOR_CONTACT.whatsappNumber;
  let message =
    'Hello School Decor team, I would like to enquire about school furniture and educational infrastructure.';
  if (productName) {
    message = `Hello School Decor team, I would like to enquire about ${productName}`;
    if (productUrl) {
      message += ` (${productUrl})`;
    }
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * Math.max(0, item.quantity), 0);
}

export function validateQuoteForm(input: QuoteFormInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push('Full name is required.');
  if (!input.phone.trim() || input.phone.replace(/[^\d]/g, '').length < 7) {
    errors.push('A valid phone number is required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!input.institution.trim()) errors.push('School or institution name is required.');
  if (!input.location.trim()) errors.push('City & State is required.');
  if (!input.requirements.trim() || input.requirements.trim().length < 5) {
    errors.push('Please describe your project requirements.');
  }
  return { valid: errors.length === 0, errors };
}

export function filterAndSortProducts(
  products: StoreProduct[],
  options: {
    collectionHandle?: string;
    availabilityOnly?: boolean;
    quoteOnlyFilter?: 'all' | 'direct' | 'quote';
    productType?: string;
    maxPrice?: number | null;
    sortBy?: 'featured' | 'price-asc' | 'price-desc';
    searchQuery?: string;
  }
): StoreProduct[] {
  const q = (options.searchQuery || '').trim().toLowerCase();
  let list = products.filter((p) => {
    if (options.collectionHandle && options.collectionHandle !== 'all' && p.collectionHandle !== options.collectionHandle) {
      return false;
    }
    if (options.availabilityOnly && !p.available) return false;
    if (options.quoteOnlyFilter === 'direct' && p.quoteOnly) return false;
    if (options.quoteOnlyFilter === 'quote' && !p.quoteOnly) return false;
    if (options.productType && options.productType !== 'all' && p.category !== options.productType) {
      return false;
    }
    if (options.maxPrice != null && !p.quoteOnly && p.price > options.maxPrice) return false;
    if (q && !`${p.title} ${p.category} ${p.description}`.toLowerCase().includes(q)) return false;
    return true;
  });

  if (options.sortBy === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (options.sortBy === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  }
  return list;
}
