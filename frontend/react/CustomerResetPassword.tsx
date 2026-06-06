import { useEffect } from 'react';
import { customerService } from '@/services/customer';
import { Button } from './ui/Button';

export interface CustomerResetPasswordSettings {
  heading?: string;
  subtext?: string;
}

interface CustomerResetPasswordProps {
  settings: CustomerResetPasswordSettings;
}

export function CustomerResetPassword({ settings }: CustomerResetPasswordProps) {
  const loginUrl = customerService.getLoginUrl();

  useEffect(() => {
    window.location.replace(loginUrl);
  }, [loginUrl]);

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto w-full max-w-md px-4 text-center sm:px-6">
        <h1 className="mb-2 font-bold uppercase leading-tight tracking-wide text-primary">
          {settings.heading ?? 'Sign in with email'}
        </h1>
        <p className="mb-8 text-text-muted">
          {settings.subtext ??
            'Password reset is not used with email verification sign-in. Continue to sign in instead.'}
        </p>
        <Button href={loginUrl} variant="primary" className="w-full">
          Continue to sign in
        </Button>
      </div>
    </section>
  );
}
