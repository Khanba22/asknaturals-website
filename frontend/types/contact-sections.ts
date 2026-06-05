export interface ContactInfoItem {
  label: string;
  value: string;
  url?: string | null;
  icon_url?: string | null;
}

export interface ContactPageSettings {
  heading?: string;
  breadcrumbs?: { title: string; url: string }[];
  intro_heading?: string;
  intro_text?: string;
  form_heading?: string;
  form_text?: string;
  form_id?: string;
  form_posted_successfully?: boolean;
  form_errors?: { field: string; message: string }[];
  form_name?: string;
  form_email?: string;
  form_phone?: string;
  form_body?: string;
  phone_default_country?: string;
  contact_items?: ContactInfoItem[];
}

export interface ContactFaqSettings {
  heading?: string;
  subheading?: string;
  background?: 'white' | 'cream';
  items?: { question: string; answer: string }[];
}
