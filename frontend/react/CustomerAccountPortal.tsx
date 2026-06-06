import { useEffect } from 'react';
import { customerService } from '@/services/customer';

export interface CustomerAccountPortalSettings {
  account_url?: string;
  heading?: string;
  body?: string;
}

interface CustomerAccountPortalProps {
  settings: CustomerAccountPortalSettings;
}

export function CustomerAccountPortal({ settings }: CustomerAccountPortalProps) {
  const accountUrl = settings.account_url ?? customerService.getAccountUrl();

  useEffect(() => {
    window.location.replace(accountUrl);
  }, [accountUrl]);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-4 text-center sm:px-6">
        <h1 className="font-bold uppercase tracking-wide text-primary">
          {settings.heading ?? 'Opening your account'}
        </h1>
        <p className="mt-4 text-sm text-text-muted">
          {settings.body ?? 'Redirecting you to your account portal…'}
        </p>
        <p className="mt-6">
          <a href={accountUrl} className="text-sm font-medium text-primary underline">
            Continue to account
          </a>
        </p>
      </div>
    </section>
  );
}
