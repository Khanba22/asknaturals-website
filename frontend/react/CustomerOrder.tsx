import { useEffect } from 'react';
import type { CustomerOrderDetail } from '@/types/shopify';
import { customerService } from '@/services/customer';
import { orderService } from '@/services/orders';
import { formatMoney } from '@/utils/formatMoney';
import { Button } from './ui/Button';

export interface CustomerOrderSettings {
  order?: CustomerOrderDetail | null;
}

interface CustomerOrderProps {
  settings: CustomerOrderSettings;
}

export function CustomerOrder({ settings }: CustomerOrderProps) {
  const customer = customerService.getCustomer();
  const order = settings.order;

  useEffect(() => {
    if (!customer) {
      window.location.href = customerService.getLoginUrl();
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  if (!order) {
    return (
      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <p className="text-text-muted">Order not found.</p>
          <div className="mt-6">
            <Button href={customerService.getAccountUrl()} variant="primary">
              Back to account
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const shipping = order.shipping_address;
  const billing = order.billing_address;

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-bold uppercase leading-tight tracking-wide text-primary">
              Order {order.name}
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Placed {orderService.formatOrderDate(order.created_at)} ·{' '}
              {orderService.getStatusLabel(order)}
            </p>
          </div>
          <a
            href={`${customerService.getAccountUrl()}#orders`}
            className="text-sm font-medium text-primary underline"
          >
            Back to orders
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold uppercase text-primary">Items</h2>
              <ul className="mt-6 divide-y divide-cream">
                {order.line_items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-primary">{item.title}</p>
                      {item.variant_title && (
                        <p className="text-sm text-text-muted">{item.variant_title}</p>
                      )}
                      <p className="mt-1 text-sm text-text-muted">Qty {item.quantity}</p>
                    </div>
                    <p className="shrink-0 font-semibold">{formatMoney(item.final_line_price)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold uppercase text-primary">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Subtotal</dt>
                  <dd className="font-medium">{formatMoney(order.subtotal_price)}</dd>
                </div>
                {order.total_tax > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Tax</dt>
                    <dd className="font-medium">{formatMoney(order.total_tax)}</dd>
                  </div>
                )}
                {order.total_shipping_price > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Shipping</dt>
                    <dd className="font-medium">{formatMoney(order.total_shipping_price)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-cream pt-2 text-base">
                  <dt className="font-semibold text-primary">Total</dt>
                  <dd className="font-bold text-primary">{formatMoney(order.total_price)}</dd>
                </div>
              </dl>
            </div>

            {shipping && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="font-heading text-sm font-bold uppercase text-primary">
                  Shipping address
                </h2>
                <address className="mt-3 not-italic text-sm leading-relaxed text-text-muted">
                  {shipping.name && <span className="block">{shipping.name}</span>}
                  {shipping.address1 && <span className="block">{shipping.address1}</span>}
                  {shipping.address2 && <span className="block">{shipping.address2}</span>}
                  <span className="block">
                    {[shipping.city, shipping.province, shipping.zip].filter(Boolean).join(', ')}
                  </span>
                  {shipping.country && <span className="block">{shipping.country}</span>}
                </address>
              </div>
            )}

            {billing && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="font-heading text-sm font-bold uppercase text-primary">
                  Billing address
                </h2>
                <address className="mt-3 not-italic text-sm leading-relaxed text-text-muted">
                  {billing.name && <span className="block">{billing.name}</span>}
                  {billing.address1 && <span className="block">{billing.address1}</span>}
                  {billing.address2 && <span className="block">{billing.address2}</span>}
                  <span className="block">
                    {[billing.city, billing.province, billing.zip].filter(Boolean).join(', ')}
                  </span>
                  {billing.country && <span className="block">{billing.country}</span>}
                </address>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
