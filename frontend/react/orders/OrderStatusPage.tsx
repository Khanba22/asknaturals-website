import { useEffect, useMemo, type ReactNode } from 'react';
import type { OrderPageOrder, OrderStatusPageSettings } from '@/types/order-pages';
import { customerService } from '@/services/customer';
import { orderService } from '@/services/orders';
import { formatMoney } from '@/utils/formatMoney';
import { Button } from '../ui/Button';
import { OrderPageChrome } from './OrderPageChrome';

interface OrderStatusPageProps {
  settings: OrderStatusPageSettings;
}

function ProgressTracker({ order }: { order: OrderPageOrder }) {
  const currentStep = orderService.getProgressStep(order);
  const labels = orderService.getProgressLabels();

  return (
    <div className="mt-8">
      <div className="flex items-center">
        {labels.map((label, index) => {
          const isComplete = index <= currentStep;
          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${isComplete ? 'bg-primary text-white' : 'bg-cream-dark text-text-muted'
                    }`}
                >
                  {isComplete ? '✓' : index + 1}
                </span>
              </div>
              {index < labels.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 ${index < currentStep ? 'bg-primary' : 'bg-cream-dark'}`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[10px] font-medium uppercase tracking-wide text-text-muted md:text-[11px]">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  );
}

export function OrderStatusPage({ settings }: OrderStatusPageProps) {
  const customer = customerService.getCustomer();
  const orderListUrl = settings.order_list_page_url ?? '/account';
  const contactUrl = settings.contact_page_url ?? '/pages/contact';

  const order = useMemo(() => {
    if (settings.order) return settings.order;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    if (!orderId) return null;
    return (settings.orders ?? []).find((item) => String(item.id) === orderId) ?? null;
  }, [settings.order, settings.orders]);

  useEffect(() => {
    if (!customer) {
      window.location.href = customerService.getLoginUrl(window.location.pathname + window.location.search);
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  if (!order) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <OrderPageChrome title="Order Summary" breadcrumbs={settings.breadcrumbs} />
          <p className="text-text-muted">Order not found.</p>
          <div className="mt-6">
            <Button href={orderListUrl} variant="primary">
              Back to order history
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const lineItem = order.line_items[0];
  const shipping = order.shipping_address;
  const transitLabel = orderService.getTransitLabel(order);
  const expectedDelivery = orderService.getExpectedDeliveryDate(order.created_at);
  const canCancel = !order.cancelled && order.fulfillment_status !== 'fulfilled';
  const shippingLabel =
    order.total_shipping_price > 0
      ? formatMoney(order.total_shipping_price)
      : 'Free';

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <OrderPageChrome title="Order Summary" breadcrumbs={settings.breadcrumbs} />

        <div className="mb-8">
          <h2 className="text-xl font-bold text-text md:text-2xl">Order {order.name}</h2>
          <p className="mt-1 text-sm text-text-muted">
            Placed on {orderService.formatOrderDate(order.created_at)}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <article className="rounded-2xl border border-cream-dark bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Expected Delivery
                  </p>
                  <p className="mt-1 text-2xl font-bold text-text md:text-3xl">{expectedDelivery}</p>
                </div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {transitLabel}
                </span>
              </div>
              <ProgressTracker order={order} />
            </article>

            <article className="overflow-hidden rounded-2xl border border-cream-dark bg-white">
              {lineItem && (
                <div className="flex gap-4 border-b border-cream-dark p-5 md:p-6">
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-cream md:size-24">
                    {lineItem.image ? (
                      <img
                        src={lineItem.image}
                        alt={lineItem.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-text">{lineItem.title}</h3>
                        {lineItem.product_description && (
                          <p className="mt-1 text-sm text-text-muted">
                            {lineItem.product_description}
                          </p>
                        )}
                        <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {lineItem.quantity} Unit{lineItem.quantity === 1 ? '' : 's'}
                        </span>
                      </div>
                      <p className="shrink-0 font-bold text-text">
                        {formatMoney(lineItem.final_line_price)}
                      </p>
                    </div>
                    {canCancel && (
                      <a
                        href={contactUrl}
                        className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline"
                      >
                        Cancel Order
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-cream px-5 py-5 md:px-6">
                <h4 className="text-xs font-bold uppercase tracking-wide text-text">Price Breakdown</h4>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Subtotal</dt>
                    <dd className="font-medium">{formatMoney(order.subtotal_price)}</dd>
                  </div>
                  {order.total_discounts > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-text-muted">Discount</dt>
                      <dd className="font-medium">-{formatMoney(order.total_discounts)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Shipping</dt>
                    <dd className="font-medium">{shippingLabel}</dd>
                  </div>
                  <div className="flex justify-between border-t border-cream-dark pt-3 text-base">
                    <dt className="font-bold text-text">Total</dt>
                    <dd className="font-bold text-text">{formatMoney(order.total_price)}</dd>
                  </div>
                </dl>
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-cream-dark bg-white p-5 md:p-6">
            <div className="flex items-center gap-2">
              <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M8 11h8M5 6h14l-1 12H6L5 6z" />
              </svg>
              <h3 className="font-bold text-text">Delivery Details</h3>
            </div>

            <div className="mt-6 space-y-5 border-b border-cream-dark pb-6">
              <div>
                <p className="text-xs text-text-muted">Delivery Date</p>
                <p className="mt-1 text-sm font-medium text-text">{expectedDelivery}</p>
                <p className="text-sm text-text-muted">By 8:00 PM</p>
              </div>

              <DetailRow
                icon={
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                label="Customer"
                value={shipping?.name ?? customer.name ?? `${customer.first_name} ${customer.last_name}`.trim()}
              />
              <DetailRow
                icon={
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Email"
                value={order.email ?? customer.email}
              />
              <DetailRow
                icon={
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                label="Phone"
                value={shipping?.phone ?? order.phone ?? '—'}
              />
            </div>

            {shipping && (
              <div className="border-b border-cream-dark py-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-text">Shipping Address</p>
                </div>
                <address className="not-italic text-sm leading-relaxed text-text-muted">
                  {shipping.address1 && <span className="block">{shipping.address1}</span>}
                  {shipping.address2 && <span className="block">{shipping.address2}</span>}
                  <span className="block">
                    {[shipping.city, shipping.province, shipping.zip].filter(Boolean).join(', ')}
                  </span>
                  {shipping.country && <span className="block">{shipping.country}</span>}
                </address>
              </div>
            )}

            <div className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="text-xs text-text-muted">Payment Method</p>
                    <p className="text-sm font-medium text-text">{orderService.getPaymentLabel(order)}</p>
                  </div>
                </div>
                {order.financial_status === 'paid' && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Paid Successfully
                  </span>
                )}
              </div>
            </div>
          </article>
        </div>

        <div className="mt-8">
          <Button href={orderListUrl} variant="outline">
            Back to order history
          </Button>
        </div>
      </div>
    </section>
  );
}
