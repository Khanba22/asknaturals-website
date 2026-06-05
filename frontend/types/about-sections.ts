export interface AboutHeroSettings {
  eyebrow?: string;
  heading?: string;
  body?: string;
  button_label?: string;
  button_link?: string;
  image_url?: string | null;
}

export interface AboutSplitSettings {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image_url?: string | null;
  image_position?: 'left' | 'right';
  color_scheme?: 'white' | 'green' | 'cream';
}

export interface AboutApproachBlock {
  label: string;
  icon_url?: string | null;
}

export interface AboutApproachSettings {
  eyebrow?: string;
  heading?: string;
  image_url?: string | null;
  leaf_background_url?: string | null;
  blocks?: AboutApproachBlock[];
}

export interface AboutVisionSettings {
  eyebrow?: string;
  heading?: string;
  body?: string;
  section_id?: string;
}

export interface AboutFounderQuoteSettings {
  quote?: string;
  bullets?: string[];
  author_name?: string;
  author_title?: string;
  leaf_background_url?: string | null;
}

export interface AboutCtaSettings {
  heading?: string;
  body?: string;
  button_1_label?: string;
  button_1_link?: string;
  button_2_label?: string;
  button_2_link?: string;
  image_url?: string | null;
}
