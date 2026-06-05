import { useEffect } from 'react';
import type { CustomerOrder } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { orderService } from '@/services/orders';
import { getRoutes } from '@/utils/routes';
import { Button } from './ui/Button';

export interface CustomerAccountSettings {
  orders?: CustomerOrder[];
}

interface CustomerAccountProps {
  settings: CustomerAccountSettings;
}

export function CustomerAccount({ settings }: CustomerAccountProps) {
  const customer = customerService.getCustomer();
  const routes = getRoutes();

  useEffect(() => {
    if (!customer) {
      window.location.href = customerService.getLoginUrl('/account');
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  const orders = orderService.sortOrdersNewestFirst(
    customerService.parseOrdersFromPage(settings),
  );

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-bold uppercase leading-tight tracking-wide text-primary">My account</h1>
            <p className="mt-2 text-text-muted">
              Welcome back, {customer.first_name || customer.email}
            </p>
          </div>
          <a
            href={customerService.getLogoutUrl()}
            className="text-sm font-medium text-primary underline"
          >
            Log out
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-1">
            <h2 className="font-heading text-lg font-bold uppercase text-primary">Details</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-text-muted">Name</dt>
                <dd className="font-medium">{customer.name || `${customer.first_name} ${customer.last_name}`}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Email</dt>
                <dd className="font-medium">{customer.email}</dd>
              </div>
            </dl>
            <div className="mt-6 space-y-2">
              <Button href={customerService.getAddressesUrl()} variant="outline" className="w-full text-center">
                Manage addresses
              </Button>
            </div>
          </div>

          <div id="orders" className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="font-heading text-lg font-bold uppercase text-primary">Order history</h2>
            {orders.length === 0 ? (
              <p className="mt-6 text-text-muted">You haven&apos;t placed any orders yet.</p>
            ) : (
              <ul className="mt-6 divide-y divide-cream">
                {orders.map((order) => (
                  <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-semibold text-primary">{order.name}</p>
                      <p className="text-sm text-text-muted">
                        {orderService.formatOrderDate(order.created_at)} ·{' '}
                        {orderService.getStatusLabel(order)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{orderService.formatOrderTotal(order.total_price)}</p>
                      <a href={order.url} className="mt-1 inline-block text-sm text-primary underline">
                        View order
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8">
              <Button
                href={routes.all_products_collection_url}
                variant="primary"
              >
                Continue shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
