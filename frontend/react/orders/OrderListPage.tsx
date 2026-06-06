import { useEffect, useMemo, useState } from 'react';
import type { OrderFilterTab, OrderListPageSettings, OrderPageOrder } from '@/types/order-pages';
import { customerService } from '@/services/customer';
import { orderService } from '@/services/orders';
import { Button } from '../ui/Button';
import { OrderPageChrome } from './OrderPageChrome';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderListPageProps {
  settings: OrderListPageSettings;
}

const TABS: { id: OrderFilterTab; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

function SearchIcon() {
  return (
    <svg className="size-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
    </svg>
  );
}

export function OrderListPage({ settings }: OrderListPageProps) {
  const customer = customerService.getCustomer();
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const orders = useMemo(
    () => orderService.sortOrdersNewestFirst(settings.orders ?? []) as OrderPageOrder[],
    [settings.orders],
  );

  const productsUrl = settings.products_page_url ?? '/collections/all';

  useEffect(() => {
    if (!customer) {
      window.location.href = customerService.getLoginUrl(window.location.pathname);
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  const filteredOrders = orders?.filter((order) => {
    if (!orderService.matchesFilter(order, activeTab)) return false;
    return orderService.orderMatchesSearch(order, appliedQuery);
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedQuery(searchQuery);
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <OrderPageChrome
          title="Order History"
          breadcrumbs={settings.breadcrumbs}
        />

        <div className="mb-8 flex flex-col gap-6 border-b border-cream-dark lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-6 md:gap-8">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 pb-3 text-sm transition-colors ${isActive
                    ? 'border-primary font-bold text-text'
                    : 'border-transparent font-medium text-text-muted hover:text-text'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="flex w-full max-w-md items-stretch gap-2 lg:mb-3">
            <label className="relative flex-1">
              <span className="sr-only">Search order ID or product</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search order ID or product"
                className="w-full rounded-lg border border-cream-dark bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-cream px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-cream-dark"
            >
              Search order
            </button>
          </form>
        </div>

        {filteredOrders && filteredOrders.length > 0 ? (
          <ul className="space-y-5">
            {filteredOrders.map((order) => {
              const lineItem = order.line_items[0];
              const trackUrl = order.url;

              return (
                <li
                  key={order.id}
                  className="rounded-2xl bg-cream p-4 md:p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-white md:size-28">
                      {lineItem?.image ? (
                        <img
                          src={lineItem.image}
                          alt={lineItem.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-text md:text-lg">
                        {lineItem?.title ?? `Order ${order.name}`}
                      </h2>
                      {lineItem?.product_description && (
                        <p className="mt-1 text-sm text-text-muted">
                          {lineItem.product_description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted md:text-sm">
                        <span>Order {order.name}</span>
                        <span aria-hidden>·</span>
                        <span>Placed {orderService.formatOrderDateShort(order.created_at)}</span>
                      </div>
                      <div className="mt-3">
                        <OrderStatusBadge order={order} />
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 md:w-44">
                      <Button href={trackUrl} variant="primary" className="w-full text-center">
                        Track Order
                      </Button>
                      <Button href={productsUrl} variant="outline" className="w-full text-center">
                        Buy Again
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl bg-cream px-6 py-12 text-center">
            <p className="text-text-muted">No orders found for this filter.</p>
            <div className="mt-6">
              <Button href={productsUrl} variant="primary">
                Shop products
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
