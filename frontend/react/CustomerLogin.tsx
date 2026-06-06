import { useEffect } from 'react';
import { customerService } from '@/services/customer';
import { Button } from './ui/Button';

export interface CustomerLoginSettings {
  heading?: string;
  subtext?: string;
  return_to?: string;
}

interface CustomerLoginProps {
  settings: CustomerLoginSettings;
}

export function CustomerLogin({ settings }: CustomerLoginProps) {
  const loginUrl = customerService.getLoginUrl(settings.return_to);
  const registerUrl = customerService.getRegisterUrl(settings.return_to);

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
      <div className="mx-auto w-full max-w-md px-4 text-center sm:px-6">
        <h1 className="mb-2 font-bold uppercase leading-tight tracking-wide text-primary">
          {settings.heading ?? 'Log in'}
        </h1>
        <p className="mb-8 text-text-muted">
          {settings.subtext ??
            'Sign in with a secure one-time code sent to your email. No password required.'}
        </p>

        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          <Button href={loginUrl} variant="primary" className="w-full">
            Continue to sign in
          </Button>
          <p className="text-sm text-text-muted">
            You&apos;ll receive a verification code by email to access your account and orders.
          </p>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          New here?{' '}
          <a href={registerUrl} className="font-medium text-primary underline">
            Create an account
          </a>
        </p>
      </div>
    </section>
  );
}
