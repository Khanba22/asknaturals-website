export interface HeroSettings {
  subtitle?: string;
  heading?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
  button_label_2?: string;
  button_link_2?: string;
  image_url?: string | null;
  overlay_header?: boolean;
  button_spacer_height?: number;
  show_trust_badges?: boolean;
  show_floating_badges?: boolean;
  color_scheme?: string;
}

export interface CategoryBlock {
  id: string;
  type: string;
  settings: {
    title?: string;
    subtitle?: string;
    icon?: string;
    icon_url?: string | null;
    custom_icon_url?: string | null;
    link?: string;
  };
}

export interface CategoriesSettings {
  heading?: string;
  subheading?: string;
  blocks?: CategoryBlock[];
  color_scheme?: string;
}

export interface ShowcaseBlock {
  id: string;
  type: string;
  settings: { text?: string };
}

export interface ShowcaseSettings {
  subtitle?: string;
  heading?: string;
  description?: string;
  image_url?: string | null;
  image_position?: 'left' | 'right';
  button_label?: string;
  button_link?: string;
  blocks?: ShowcaseBlock[];
  color_scheme?: string;
}

export interface FeatureBlock {
  id: string;
  type: string;
  settings: {
    title?: string;
    description?: string;
    emoji?: string;
    icon_url?: string | null;
    custom_icon_url?: string | null;
  };
}

export interface FeaturesSettings {
  heading?: string;
  subheading?: string;
  blocks?: FeatureBlock[];
  color_scheme?: string;
}

export interface TestimonialBlock {
  id: string;
  type: string;
  settings: {
    quote?: string;
    author_name?: string;
    author_title?: string;
    author_image_url?: string | null;
    rating?: number;
    verified?: boolean;
  };
}

export interface TestimonialsSettings {
  heading?: string;
  subheading?: string;
  know_more_label?: string;
  know_more_link?: string;
  blocks?: TestimonialBlock[];
  color_scheme?: string;
}

export interface FooterMenuBlock {
  id: string;
  type: string;
  settings: {
    title?: string;
    menu_handle?: string;
    links?: { title: string; url: string }[];
  };
}

export interface FooterSettings {
  footer_description?: string;
  show_newsletter?: boolean;
  newsletter_title?: string;
  newsletter_description?: string;
  newsletter_placeholder?: string;
  show_contact?: boolean;
  contact_title?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  show_payment_icons?: boolean;
  logo_url?: string | null;
  shop_name?: string;
  blocks?: FooterMenuBlock[];
  policy_links?: { title: string; url: string }[];
  social_links?: { id: string; label: string; url: string }[];
  color_scheme?: string;
}

export interface ProductGridSettings {
  heading?: string;
  subheading?: string;
  button_label?: string;
  button_link?: string;
  products?: import('./shopify').LiquidProduct[];
  collection_handle?: string | null;
  collection_title?: string;
  show_shop_header?: boolean;
  color_scheme?: string;
}

export interface HeaderSettings {
  logo_url?: string | null;
  shop_name?: string;
  menu_links?: { title: string; url: string }[];
  utility_links?: { title: string; url: string }[];
  overlay_hero?: boolean;
}

export interface CartDrawerSettings {
  empty_message?: string;
}

export interface SearchSettings {
  placeholder?: string;
}
