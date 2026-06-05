import { useEffect, useState } from 'react';
import type { CustomerAddress, CustomerFormError } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { getRoutes } from '@/utils/routes';
import { Button } from './ui/Button';
import { FormErrors } from './ui/FormErrors';

export interface CustomerAddressesSettings {
  addresses?: CustomerAddress[];
  form_errors?: CustomerFormError[];
  default_country?: string;
}

interface CustomerAddressesProps {
  settings: CustomerAddressesSettings;
}

const inputClass =
  'w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function AddressFields({
  prefix,
  address,
  defaultCountry,
}: {
  prefix: string;
  address?: CustomerAddress;
  defaultCountry?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${prefix}-first_name`} className="mb-1 block text-sm font-medium">
          First name
        </label>
        <input
          id={`${prefix}-first_name`}
          name="address[first_name]"
          defaultValue={address?.first_name ?? ''}
          autoComplete="given-name"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-last_name`} className="mb-1 block text-sm font-medium">
          Last name
        </label>
        <input
          id={`${prefix}-last_name`}
          name="address[last_name]"
          defaultValue={address?.last_name ?? ''}
          autoComplete="family-name"
          required
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-company`} className="mb-1 block text-sm font-medium">
          Company
        </label>
        <input
          id={`${prefix}-company`}
          name="address[company]"
          defaultValue={address?.company ?? ''}
          autoComplete="organization"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-address1`} className="mb-1 block text-sm font-medium">
          Address
        </label>
        <input
          id={`${prefix}-address1`}
          name="address[address1]"
          defaultValue={address?.address1 ?? ''}
          autoComplete="address-line1"
          required
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-address2`} className="mb-1 block text-sm font-medium">
          Apartment, suite, etc.
        </label>
        <input
          id={`${prefix}-address2`}
          name="address[address2]"
          defaultValue={address?.address2 ?? ''}
          autoComplete="address-line2"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-city`} className="mb-1 block text-sm font-medium">
          City
        </label>
        <input
          id={`${prefix}-city`}
          name="address[city]"
          defaultValue={address?.city ?? ''}
          autoComplete="address-level2"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-zip`} className="mb-1 block text-sm font-medium">
          Postal / ZIP code
        </label>
        <input
          id={`${prefix}-zip`}
          name="address[zip]"
          defaultValue={address?.zip ?? ''}
          autoComplete="postal-code"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-province`} className="mb-1 block text-sm font-medium">
          Province / State
        </label>
        <input
          id={`${prefix}-province`}
          name="address[province]"
          defaultValue={address?.province ?? ''}
          autoComplete="address-level1"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-country`} className="mb-1 block text-sm font-medium">
          Country
        </label>
        <input
          id={`${prefix}-country`}
          name="address[country]"
          defaultValue={address?.country ?? defaultCountry ?? ''}
          autoComplete="country-name"
          required
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-phone`} className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input
          id={`${prefix}-phone`}
          name="address[phone]"
          type="tel"
          defaultValue={address?.phone ?? ''}
          autoComplete="tel"
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          id={`${prefix}-default`}
          name="address[default]"
          type="checkbox"
          value="1"
          defaultChecked={address?.default ?? false}
          className="h-4 w-4 rounded border-cream-dark text-primary focus:ring-primary"
        />
        <label htmlFor={`${prefix}-default`} className="text-sm">
          Set as default address
        </label>
      </div>
    </div>
  );
}

function formatAddressBlock(address: CustomerAddress): string {
  const lines = [
    `${address.first_name} ${address.last_name}`.trim(),
    address.company,
    address.address1,
    address.address2,
    [address.city, address.province, address.zip].filter(Boolean).join(', '),
    address.country,
    address.phone,
  ].filter(Boolean);
  return lines.join('\n');
}

export function CustomerAddresses({ settings }: CustomerAddressesProps) {
  const customer = customerService.getCustomer();
  const routes = getRoutes();
  const token = customerService.getAuthenticityToken();
  const formErrors = customerService.parseFormErrors(settings);
  const addresses = settings.addresses ?? [];
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!customer) {
      window.location.href = customerService.getLoginUrl('/account/addresses');
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-bold uppercase leading-tight tracking-wide text-primary">
              Addresses
            </h1>
            <p className="mt-2 text-text-muted">Manage your shipping addresses</p>
          </div>
          <a href={customerService.getAccountUrl()} className="text-sm font-medium text-primary underline">
            Back to account
          </a>
        </div>

        <div className="mb-6">
          <FormErrors errors={formErrors} />
        </div>

        {addresses.length === 0 && !showNewForm ? (
          <p className="mb-6 text-text-muted">You have no saved addresses yet.</p>
        ) : (
          <ul className="mb-8 space-y-4">
            {addresses.map((address) => (
              <li key={address.id} className="rounded-2xl bg-white p-6 shadow-sm">
                {editingId === address.id ? (
                  <form
                    method="post"
                    action={address.url}
                    acceptCharset="UTF-8"
                    className="space-y-4"
                  >
                    <input type="hidden" name="form_type" value="customer_address" />
                    <input type="hidden" name="utf8" value="✓" />
                    {token && <input type="hidden" name="authenticity_token" value={token} />}
                    <AddressFields
                      prefix={`edit-${address.id}`}
                      address={address}
                      defaultCountry={settings.default_country}
                    />
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" variant="primary">
                        Save address
                      </Button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-sm font-medium text-primary underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {formatAddressBlock(address)}
                      </pre>
                      {address.default && (
                        <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <button
                        type="button"
                        onClick={() => setEditingId(address.id)}
                        className="text-sm font-medium text-primary underline"
                      >
                        Edit
                      </button>
                      <form method="post" action={address.url} className="inline">
                        <input type="hidden" name="form_type" value="customer_address" />
                        <input type="hidden" name="utf8" value="✓" />
                        <input type="hidden" name="_method" value="delete" />
                        {token && <input type="hidden" name="authenticity_token" value={token} />}
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-700 underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {showNewForm ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-lg font-bold uppercase text-primary">
              Add address
            </h2>
            <form
              method="post"
              action={routes.account_addresses_url}
              acceptCharset="UTF-8"
              className="space-y-4"
            >
              <input type="hidden" name="form_type" value="customer_address" />
              <input type="hidden" name="utf8" value="✓" />
              {token && <input type="hidden" name="authenticity_token" value={token} />}
              <AddressFields prefix="new" defaultCountry={settings.default_country} />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="primary">
                  Add address
                </Button>
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="text-sm font-medium text-primary underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={() => setShowNewForm(true)}>
            Add a new address
          </Button>
        )}
      </div>
    </section>
  );
}
