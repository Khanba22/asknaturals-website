export interface ProductVariant {
  id: number;
  title: string;
  price: number;
  compare_at_price: number | null;
  available: boolean;
  image?: string | null;
}

export interface ProductDetailData {
  id: number;
  title: string;
  handle: string;
  url: string;
  vendor?: string;
  description?: string;
  featured_image: string | null;
  images: string[];
  variants: ProductVariant[];
  available: boolean;
}

export interface ProductDetailSettings {
  product: ProductDetailData;
  category?: string;
  review_count?: number;
  short_description?: string;
  subscribe_price?: number | null;
  onetime_price?: number | null;
  breadcrumbs?: { title: string; url: string }[];
  trust_badges?: { label: string; icon: string }[];
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface ProductAccordionSettings {
  items?: AccordionItem[];
}

export interface ProductStorySettings {
  heading?: string;
  paragraphs?: string[];
  image_url?: string | null;
  image_position?: 'left' | 'right';
}

export interface IngredientItem {
  title: string;
  short_label: string;
  description: string;
}

export interface ProductIngredientsSettings {
  heading?: string;
  hub_label?: string;
  hub_description?: string;
  ingredients?: IngredientItem[];
}

export interface ProductLabVerifiedSettings {
  heading?: string;
  description?: string;
  stat_1_value?: string;
  stat_1_label?: string;
  stat_2_value?: string;
  stat_2_label?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductFaqSettings {
  heading?: string;
  subheading?: string;
  items?: FaqItem[];
}
