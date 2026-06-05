import { useEffect, useMemo } from 'react';
import type { ContactPageSettings } from '@/types/contact-sections';
import { Button } from '../ui/Button';
import { FormErrors } from '../ui/FormErrors';

interface ContactPageProps {
  settings: ContactPageSettings;
}

const inputClass =
  'w-full rounded-lg border border-cream-dark bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function ContactIcon({ iconUrl, label }: { iconUrl?: string | null; label: string }) {
  if (iconUrl) {
    return (
      <span className="flex size-11 shrink-0 overflow-hidden rounded-full">
        <img src={iconUrl} alt="" className="size-full object-cover" />
      </span>
    );
  }
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold uppercase text-primary"
      aria-hidden
    >
      {label.charAt(0)}
    </span>
  );
}

function splitName(name?: string) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function ContactPage({ settings }: ContactPageProps) {
  const items = settings.contact_items ?? [];
  const formId = settings.form_id ?? 'ContactForm';
  const { first: defaultFirst, last: defaultLast } = useMemo(
    () => splitName(settings.form_name),
    [settings.form_name],
  );

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;

    const onSubmit = () => {
      const first =
        (form.querySelector('#ContactFirstName') as HTMLInputElement | null)?.value.trim() ?? '';
      const last =
        (form.querySelector('#ContactLastName') as HTMLInputElement | null)?.value.trim() ?? '';
      const nameField = form.querySelector('input[name="contact[name]"]') as HTMLInputElement | null;
      if (nameField) {
        nameField.value = [first, last].filter(Boolean).join(' ');
      }
    };

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [formId]);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center md:mb-14">
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-text md:text-4xl">
            {settings.heading ?? 'Contact us'}
          </h1>
          {settings.breadcrumbs && settings.breadcrumbs.length > 0 && (
            <nav className="mt-3 text-sm text-text-muted" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center justify-center gap-1">
                {settings.breadcrumbs.map((crumb, index) => (
                  <li key={crumb.url} className="flex items-center gap-1">
                    {index > 0 && <span>/</span>}
                    {index === settings.breadcrumbs!.length - 1 ? (
                      <span>{crumb.title}</span>
                    ) : (
                      <a href={crumb.url} className="hover:text-primary">
                        {crumb.title}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-cream lg:grid-cols-2">
          <div className="border-b border-cream px-6 py-10 md:px-10 md:py-12 lg:border-b-0 lg:border-r">
            <h2 className="text-xl font-bold text-text md:text-2xl">
              {settings.intro_heading ?? 'Get in touch'}
            </h2>
            {settings.intro_text && (
              <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
                {settings.intro_text}
              </p>
            )}

            <ul className="mt-10 space-y-8">
              {items.filter((item) => item.label || item.value).map((item, index) => {
                const content = (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm font-medium text-text md:text-base">
                      {item.value}
                    </p>
                  </>
                );

                return (
                  <li key={`${index}-${item.label}`} className="flex gap-4">
                    <ContactIcon iconUrl={item.icon_url} label={item.label} />
                    <div>
                      {item.url ? (
                        <a
                          href={item.url}
                          className="block hover:text-primary"
                          target={item.url.startsWith('http') ? '_blank' : undefined}
                          rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-cream px-6 py-10 md:px-10 md:py-12">
            <h2 className="text-xl font-bold text-text md:text-2xl">
              {settings.form_heading ?? 'Send us a message'}
            </h2>
            {settings.form_text && (
              <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-base">
                {settings.form_text}
              </p>
            )}

            {settings.form_posted_successfully && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Thanks for reaching out. We&apos;ll get back to you shortly.
              </div>
            )}

            {settings.form_errors && settings.form_errors.length > 0 && (
              <div className="mt-6">
                <FormErrors errors={settings.form_errors} />
              </div>
            )}

            <div className="mt-8 space-y-5">
              <input
                type="hidden"
                name="contact[name]"
                form={formId}
                defaultValue={settings.form_name ?? ''}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ContactFirstName" className="mb-1.5 block text-sm font-medium">
                    First name
                  </label>
                  <input
                    id="ContactFirstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    defaultValue={defaultFirst}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="ContactLastName" className="mb-1.5 block text-sm font-medium">
                    Last name
                  </label>
                  <input
                    id="ContactLastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    defaultValue={defaultLast}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ContactEmail" className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="ContactEmail"
                    name="contact[email]"
                    form={formId}
                    type="email"
                    autoComplete="email"
                    required
                    defaultValue={settings.form_email ?? ''}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="ContactPhone" className="mb-1.5 block text-sm font-medium">
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex shrink-0 items-center rounded-lg border border-cream-dark bg-white px-3 text-sm text-text-muted">
                      {settings.phone_default_country ?? 'IN'}
                    </span>
                    <input
                      id="ContactPhone"
                      name="contact[phone]"
                      form={formId}
                      type="tel"
                      autoComplete="tel"
                      defaultValue={settings.form_phone ?? ''}
                      className={`${inputClass} min-w-0 flex-1`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="ContactMessage" className="mb-1.5 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="ContactMessage"
                  name="contact[body]"
                  form={formId}
                  rows={5}
                  required
                  placeholder="Leave us a message..."
                  defaultValue={settings.form_body ?? ''}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <Button type="submit" form={formId} variant="primary" className="w-full sm:w-auto">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
