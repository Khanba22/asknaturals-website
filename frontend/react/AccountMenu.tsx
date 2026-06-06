import { useEffect, useRef, useState } from 'react';
import { customerService } from '@/services/customer';

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const customer = customerService.getCustomer();
  const loggedIn = customerService.isLoggedIn();

  const signInUrl = customerService.getStorefrontLoginUrl();
  const accountUrl = customerService.getAccountUrl();
  const ordersUrl = loggedIn ? accountUrl : customerService.getLoginUrl('/account');
  const profileUrl = loggedIn
    ? customerService.getAddressesUrl()
    : customerService.getLoginUrl('/account/addresses');

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full p-2 text-white transition hover:bg-white/10"
        aria-label={loggedIn ? 'Account menu' : 'Sign in'}
        aria-expanded={open}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-cream-dark bg-white py-2 shadow-lg">
          {loggedIn && customer ? (
            <p className="border-b border-cream px-4 py-2 text-sm font-medium text-primary">
              Hi, {customer.first_name || customer.email}
            </p>
          ) : null}

          <a
            href={loggedIn ? accountUrl : signInUrl}
            className="block px-4 py-2 text-sm font-medium text-text hover:bg-cream"
          >
            My account
          </a>
          <a href={ordersUrl} className="block px-4 py-2 text-sm text-text hover:bg-cream">
            Orders
          </a>
          <a href={profileUrl} className="block px-4 py-2 text-sm text-text hover:bg-cream">
            Profile
          </a>

          {!loggedIn && (
            <a
              href={signInUrl}
              className="block border-t border-cream px-4 py-2 text-sm font-medium text-primary hover:bg-cream"
            >
              Sign in
            </a>
          )}

          {loggedIn && (
            <a
              href={customerService.getLogoutUrl()}
              className="block px-4 py-2 text-sm text-text-muted hover:bg-cream"
            >
              Log out
            </a>
          )}
        </div>
      )}
    </div>
  );
}
