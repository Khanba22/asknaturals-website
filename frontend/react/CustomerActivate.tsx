import type { CustomerFormError } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { Button } from './ui/Button';
import { FormErrors } from './ui/FormErrors';

export interface CustomerActivateSettings {
  heading?: string;
  subtext?: string;
  form_errors?: CustomerFormError[];
  form_type?: string;
}

interface CustomerActivateProps {
  settings: CustomerActivateSettings;
}

const inputClass =
  'w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-primary focus:outline-none';

export function CustomerActivate({ settings }: CustomerActivateProps) {
  const token = customerService.getAuthenticityToken();
  const formErrors = customerService.parseFormErrors(settings);

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <h1 className="mb-2 text-center font-bold uppercase leading-tight tracking-wide text-primary">
          {settings.heading ?? 'Activate account'}
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
          <input type="hidden" name="form_type" value="activate_customer_password" />
          <input type="hidden" name="utf8" value="✓" />
          {token && <input type="hidden" name="authenticity_token" value={token} />}

          <FormErrors errors={formErrors} />

          <div>
            <label htmlFor="ActivatePassword" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="ActivatePassword"
              type="password"
              name="customer[password]"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="ActivatePasswordConfirm" className="mb-1 block text-sm font-medium">
              Confirm password
            </label>
            <input
              id="ActivatePasswordConfirm"
              type="password"
              name="customer[password_confirmation]"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Activate account
          </Button>
          <Button
            type="submit"
            name="decline"
            variant="outline"
            className="w-full"
          >
            Decline invitation
          </Button>
        </form>
      </div>
    </section>
  );
}
