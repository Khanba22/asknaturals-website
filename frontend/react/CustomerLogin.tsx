import { useEffect, useState } from 'react';
import type { CustomerFormError } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { getRoutes } from '@/utils/routes';
import { Button } from './ui/Button';
import { FormErrors } from './ui/FormErrors';

export interface CustomerLoginSettings {
  heading?: string;
  subtext?: string;
  return_to?: string;
  form_errors?: CustomerFormError[];
  recover_success?: boolean;
  form_type?: string;
}

interface CustomerLoginProps {
  settings: CustomerLoginSettings;
}

const inputClass =
  'w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

export function CustomerLogin({ settings }: CustomerLoginProps) {
  const routes = getRoutes();
  const token = customerService.getAuthenticityToken();
  const formErrors = customerService.parseFormErrors(settings);
  const isRecoverForm = settings.form_type === 'recover_customer_password';
  const loginErrors = !isRecoverForm ? formErrors : [];
  const recoverErrors = isRecoverForm ? formErrors : [];

  const [showRecover, setShowRecover] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#recover';
  });

  useEffect(() => {
    if (customerService.isLoggedIn()) {
      window.location.href = customerService.getAccountUrl();
    }
  }, []);

  useEffect(() => {
    const syncRecover = () => setShowRecover(window.location.hash === '#recover');
    syncRecover();
    window.addEventListener('hashchange', syncRecover);
    return () => window.removeEventListener('hashchange', syncRecover);
  }, []);

  if (customerService.isLoggedIn()) {
    return null;
  }

  const returnTo = settings.return_to ?? window.location.pathname;

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        {showRecover ? (
          <>
            <h1 className="mb-2 text-center font-bold uppercase leading-tight tracking-wide text-primary">
              Reset password
            </h1>
            <p className="mb-8 text-center text-text-muted">
              We&apos;ll email you a link to reset your password.
            </p>

            {settings.recover_success && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Check your email for a link to reset your password.
              </div>
            )}

            <form
              method="post"
              action={routes.account_recover_url}
              acceptCharset="UTF-8"
              className="space-y-4 rounded-2xl bg-white p-8 shadow-sm"
            >
              <input type="hidden" name="form_type" value="recover_customer_password" />
              <input type="hidden" name="utf8" value="✓" />
              {token && <input type="hidden" name="authenticity_token" value={token} />}

              <FormErrors errors={recoverErrors} />

              <div>
                <label htmlFor="RecoverEmail" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="RecoverEmail"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Send reset link
              </Button>
            </form>

            <p className="mt-6 text-center text-sm">
              <a href={routes.account_login_url} className="font-medium text-primary underline">
                Back to log in
              </a>
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-center font-bold uppercase leading-tight tracking-wide text-primary">
              {settings.heading ?? 'Log in'}
            </h1>
            {settings.subtext && (
              <p className="mb-8 text-center text-text-muted">{settings.subtext}</p>
            )}

            <form
              method="post"
              action={routes.account_login_url}
              acceptCharset="UTF-8"
              className="space-y-4 rounded-2xl bg-white p-8 shadow-sm"
            >
              <input type="hidden" name="form_type" value="customer_login" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="return_to" value={returnTo} />
              {token && <input type="hidden" name="authenticity_token" value={token} />}

              <FormErrors errors={loginErrors} />

              <div>
                <label htmlFor="CustomerEmail" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="CustomerEmail"
                  type="email"
                  name="customer[email]"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="CustomerPassword" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="CustomerPassword"
                  type="password"
                  name="customer[password]"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Log in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
              New here?{' '}
              <a href={customerService.getRegisterUrl()} className="font-medium text-primary underline">
                Create an account
              </a>
            </p>
            <p className="mt-2 text-center text-sm">
              <a href={`${routes.account_login_url}#recover`} className="text-primary underline">
                Forgot password?
              </a>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
