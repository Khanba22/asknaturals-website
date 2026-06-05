import type { CustomerFormError } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { getRoutes } from '@/utils/routes';
import { Button } from './ui/Button';
import { FormErrors } from './ui/FormErrors';

export interface CustomerResetPasswordSettings {
  heading?: string;
  subtext?: string;
  form_errors?: CustomerFormError[];
  form_type?: string;
}

interface CustomerResetPasswordProps {
  settings: CustomerResetPasswordSettings;
}

const inputClass =
  'w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-primary focus:outline-none';

export function CustomerResetPassword({ settings }: CustomerResetPasswordProps) {
  const routes = getRoutes();
  const token = customerService.getAuthenticityToken();
  const formErrors = customerService.parseFormErrors(settings);

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="mb-2 text-center font-bold uppercase leading-tight tracking-wide text-primary">
          {settings.heading ?? 'Reset password'}
        </h1>
        {settings.subtext && (
          <p className="mb-8 text-center text-text-muted">{settings.subtext}</p>
        )}

        <form
          method="post"
          action={window.location.pathname + window.location.search}
          acceptCharset="UTF-8"
          className="space-y-4 rounded-2xl bg-white p-8 shadow-sm"
        >
          <input type="hidden" name="form_type" value="reset_customer_password" />
          <input type="hidden" name="utf8" value="✓" />
          {token && <input type="hidden" name="authenticity_token" value={token} />}

          <FormErrors errors={formErrors} />

          <div>
            <label htmlFor="ResetPassword" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="ResetPassword"
              type="password"
              name="customer[password]"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="ResetPasswordConfirm" className="mb-1 block text-sm font-medium">
              Confirm password
            </label>
            <input
              id="ResetPasswordConfirm"
              type="password"
              name="customer[password_confirmation]"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Reset password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          <a href={routes.account_login_url} className="font-medium text-primary underline">
            Back to log in
          </a>
        </p>
      </div>
    </section>
  );
}
