import type { FooterSettings } from '@/types/section-settings';
import { getRoutes } from '@/utils/routes';
import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';

interface FooterProps {
  settings: FooterSettings;
}

function RichText({ html }: { html?: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const SOCIAL_ICONS = [
  { id: 'twitter', label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { id: 'facebook', label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { id: 'instagram', label: 'Instagram', path: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 13a4 4 0 100-8 4 4 0 000 8zm6-9h1' },
  { id: 'youtube', label: 'YouTube', path: 'M22 8l-6 4 6 4V8M2 6h12a2 2 0 012 2v8a2 2 0 01-2 2H2V6z' },
];

export function Footer({ settings }: FooterProps) {
  const blocks = settings.blocks ?? [];
  const year = new Date().getFullYear();
  const exploreBlock = blocks.find((b) => b.settings.title?.toLowerCase().includes('explore')) ?? blocks[0];
  const routes = getRoutes();
  const token = getShopifyBootstrap().authenticity_token;

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-16">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-16">
          <div className="lg:col-span-1">
            <img
              src={settings.logo_url ?? ''}
              alt={settings.shop_name ?? 'AskNatural'}
              className="mb-5 h-10 w-auto max-w-[220px] object-contain"
            />
            {settings.footer_description && (
              <div className="max-w-xs text-sm leading-relaxed text-white/80 [&_p]:m-0">
                <RichText html={settings.footer_description} />
              </div>
            )}
          </div>

          {exploreBlock && (
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest">
                {exploreBlock.settings.title ?? 'Explore'}
              </h3>
              <ul className="space-y-2.5 text-sm text-white/85">
                {(exploreBlock.settings.links ?? []).map((link) => (
                  <li key={link.url}>
                    <a href={link.url} className="transition hover:text-white">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {settings.policy_links && settings.policy_links.length > 0 && (
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest">Policies</h3>
              <ul className="space-y-2.5 text-sm text-white/85">
                {settings.policy_links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} className="transition hover:text-white">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {settings.show_newsletter && (
            <div className="lg:col-span-1">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest">
                {settings.newsletter_title ?? 'Join the wellness journal'}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/80">
                {settings.newsletter_description}
              </p>
              <form
                action={routes.contact_url}
                method="post"
                acceptCharset="UTF-8"
                className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                <input type="hidden" name="form_type" value="customer" />
                <input type="hidden" name="utf8" value="✓" />
                {token && <input type="hidden" name="authenticity_token" value={token} />}
                <input
                  type="email"
                  name="contact[email]"
                  placeholder={settings.newsletter_placeholder ?? 'Your email address'}
                  className="min-w-0 flex-1 rounded-lg border-0 bg-primary-light px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary transition hover:bg-cream"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xs text-white/70">
                © {year} {settings.shop_name ?? 'AskNatural'}. All rights reserved.
              </p>
              <div className="flex gap-3">
                {(settings.social_links ?? []).map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    className="text-white/80 transition hover:text-white"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d={SOCIAL_ICONS.find((s) => s.id === social.id)?.path ?? ''} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            {settings.policy_links && settings.policy_links.length > 0 && (
              <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
                {settings.policy_links.map((link) => (
                  <a key={link.url} href={link.url} className="hover:text-white">
                    {link.title}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
