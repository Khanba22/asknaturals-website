import { useEffect } from 'react';
import { customerService } from '@/services/customer';
import { Button } from './ui/Button';

export interface CustomerRegisterSettings {
  heading?: string;
  subtext?: string;
}

interface CustomerRegisterProps {
  settings: CustomerRegisterSettings;
}

export function CustomerRegister({ settings }: CustomerRegisterProps) {
  const signInUrl = customerService.getRegisterUrl('/account');

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
          {settings.heading ?? 'Create account'}
        </h1>
        <p className="mb-8 text-text-muted">
          {settings.subtext ??
            'Create your account with a secure email verification code. No password required.'}
        </p>

        <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
          <Button href={signInUrl} variant="primary" className="w-full">
            Continue with email
          </Button>
          <p className="text-sm text-text-muted">
            Enter your email on the next screen. We&apos;ll send you a one-time code to verify your
            account.
          </p>
        </div>

        <p className="mt-6 text-sm text-text-muted">
          Already have an account?{' '}
          <a href={customerService.getLoginUrl()} className="font-medium text-primary underline">
            Sign in
          </a>
        </p>
      </div>
    </section>
  );
}
