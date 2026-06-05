import { useEffect } from 'react';
import type { CustomerFormError } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { getRoutes } from '@/utils/routes';
import { Button } from './ui/Button';
import { FormErrors } from './ui/FormErrors';

export interface CustomerRegisterSettings {
  heading?: string;
  subtext?: string;
  form_errors?: CustomerFormError[];
  form_type?: string;
}

interface CustomerRegisterProps {
  settings: CustomerRegisterSettings;
}

const inputClass =
  'w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-primary focus:outline-none';

export function CustomerRegister({ settings }: CustomerRegisterProps) {
  const routes = getRoutes();
  const token = customerService.getAuthenticityToken();
  const formErrors = customerService.parseFormErrors(settings);

  useEffect(() => {
    if (customerService.isLoggedIn()) {
      window.location.href = customerService.getAccountUrl();
    }
  }, []);

  if (customerService.isLoggedIn()) {
    return null;
  }

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="mb-2 text-center font-bold uppercase leading-tight tracking-wide text-primary">
          {settings.heading ?? 'Create account'}
        </h1>
        {settings.subtext && (
          <p className="mb-8 text-center text-text-muted">{settings.subtext}</p>
        )}

        <form
          method="post"
          action={routes.account_url}
          acceptCharset="UTF-8"
          className="space-y-4 rounded-2xl bg-white p-8 shadow-sm"
        >
          <input type="hidden" name="form_type" value="create_customer" />
          <input type="hidden" name="utf8" value="✓" />
          {token && <input type="hidden" name="authenticity_token" value={token} />}

          <FormErrors errors={formErrors} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="FirstName" className="mb-1 block text-sm font-medium">
                First name
              </label>
              <input
                id="FirstName"
                name="customer[first_name]"
                autoComplete="given-name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="LastName" className="mb-1 block text-sm font-medium">
                Last name
              </label>
              <input
                id="LastName"
                name="customer[last_name]"
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="RegisterEmail" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="RegisterEmail"
              type="email"
              name="customer[email]"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="RegisterPassword" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="RegisterPassword"
              type="password"
              name="customer[password]"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <a href={customerService.getLoginUrl()} className="font-medium text-primary underline">
            Log in
          </a>
        </p>
      </div>
    </section>
  );
}
