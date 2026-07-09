import { useMemo, useState } from 'react';
import type { ProductDetailSettings, ProductVariant } from '@/types/product-sections';
import { formatMoney } from '@/utils/formatMoney';
import { cartService } from '@/services/cart';
import { customerService } from '@/services/customer';
import { dispatchOpenCart } from '@/utils/events';
import { TrustBadgeIcon } from './ProductIcons';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MainProductProps {
  settings: ProductDetailSettings;
}

type PurchaseMode = 'subscribe_30' | 'subscribe_7' | 'onetime_7' | 'onetime_30' | null;

function getVariantPrices(
  variant: ProductVariant | undefined,
  settings: ProductDetailSettings,
) {
  const subscribePrice =
    settings.subscribe_price ?? variant?.compare_at_price ?? variant?.price ?? 0;
  const onetimePrice = settings.onetime_price ?? variant?.price ?? subscribePrice;
  return { subscribePrice, onetimePrice };
}

const DEFAULT_BADGES = [
  { label: 'Lab Tested', icon: 'beaker' },
  { label: 'Authenticity Verified', icon: 'check' },
  { label: 'Women Formulated', icon: 'female' },
];

export function MainProduct({ settings }: MainProductProps) {
  const { product } = settings;
  const variants = product.variants?.length ? product.variants : [];
  const images = product.images?.length
    ? product.images
    : product.featured_image
      ? [product.featured_image]
      : [];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => variants.find((v) => v.available)?.id ?? variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>(null);
  const [adding, setAdding] = useState(false);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId],
  );

  const { subscribePrice, onetimePrice } = getVariantPrices(selectedVariant, settings);
  const displayPrice = purchaseMode?.startsWith('subscribe') ? subscribePrice : onetimePrice;

  const selectVariant = (variant: ProductVariant) => {
    if (!variant.available) return;
    setSelectedVariantId(variant.id);
    if (variant.image) {
      const imageIndex = images.indexOf(variant.image);
      if (imageIndex >= 0) setActiveImage(imageIndex);
    }
  };
  const badges = settings.trust_badges ?? DEFAULT_BADGES;
  const breadcrumbs = settings.breadcrumbs ?? [];

  const prevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setActiveImage((i) => (i + 1) % images.length);

  const addToCart = async (redirectCheckout = false) => {
    if (!selectedVariant?.available) return;
    setAdding(true);
    try {
      await cartService.addLine({
        id: selectedVariant.id,
        quantity,
        meta: { productTitle: product.title, variantTitle: selectedVariant.title },
      });
      if (redirectCheckout) {
        window.location.href = customerService.getCheckoutUrl();
      } else {
        dispatchOpenCart();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not add to cart';
      window.alert(message);
    } finally {
      setAdding(false);
    }
  };

  const shortDescription =
    settings.short_description ??
    (product.description
      ? product.description.replace(/<[^>]+>/g, '').slice(0, 220)
      : '');

  return (
    <section className="bg-white pb-12 pt-6 md:pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {breadcrumbs.length > 0 && (
          <nav className="mb-8 text-sm text-text-muted" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.url} className="flex items-center gap-1">
                  {index > 0 && <span className="text-text-muted/60">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-text">{crumb.title}</span>
                  ) : (
                    <a href={crumb.url} className="hover:text-primary">
                      {crumb.title}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="hidden flex-col gap-3 sm:flex">
                {images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-current={activeImage === index}
                    aria-label={`View image ${index + 1}`}
                    className={`size-16 overflow-hidden rounded-xl border-2 bg-white transition ${activeImage === index
                      ? 'border-primary'
                      : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={src} alt="" className="size-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <div className="group relative aspect-square flex-1 overflow-hidden rounded-3xl bg-transparent">
              {images[activeImage] ? (
                <img
                  key={images[activeImage]}
                  src={images[activeImage]}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-contain animate-in fade-in duration-200"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-text-muted">
                  No image
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-text opacity-0 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
                  >
                    <ChevronLeft className="size-5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-text opacity-0 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
                  >
                    <ChevronRight className="size-5" strokeWidth={2} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Product info */}
          <div>
            {settings.category && (
              <p className="mb-2 text-sm text-text-muted">{settings.category}</p>
            )}
            <h1 className="font-bold uppercase leading-tight tracking-wide text-primary text-3xl md:text-4xl lg:text-[2.75rem]">
              {product.title}
            </h1>

            {settings.review_count != null && settings.review_count > 0 && (
              <p className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-amber-500" aria-hidden>
                  ★
                </span>
                <span className="font-medium">{settings.review_count} reviews</span>
              </p>
            )}

            {shortDescription && (
              <p className="mt-5 text-sm leading-relaxed text-text-muted md:text-base">
                {shortDescription}
              </p>
            )}

            {/* Variant options */}
            {variants.length > 0 && (
              <div className="mt-8 space-y-3">
                {variants.map((variant: ProductVariant) => {
                  const { subscribePrice: variantSubscribePrice } = getVariantPrices(variant, settings);
                  const isSelected = selectedVariantId === variant.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={!variant.available}
                      onClick={() => selectVariant(variant)}
                      className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-cream-dark bg-white hover:border-primary/40'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-primary">
                            {variant.title}
                          </p>
                          {!variant.available && (
                            <p className="mt-1 text-sm text-text-muted">Sold out</p>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {formatMoney(variantSubscribePrice)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Purchase options */}
            <div className="mt-8 space-y-3  pointer-events-none cursor-not-allowed">


              <div
                className={`rounded-2xl  border-2 px-5 py-4 transition ${purchaseMode?.startsWith('subscribe')
                  ? 'border-gray-500 bg-gray-500/5'
                  : 'border-cream-dark bg-white hover:border-primary/40'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setPurchaseMode('subscribe_30')}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Subscribe &amp; Save ( Coming Soon )
                      </p>
                      {purchaseMode?.startsWith('subscribe') && (
                        <p className="mt-1 text-sm text-text-muted">Choose delivery frequency</p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-gray-500">Coming Soon</p>
                  </div>
                </button>

                {purchaseMode?.startsWith('subscribe') && (
                  <div className="mt-4 space-y-2 border-t border-primary/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setPurchaseMode('subscribe_7')}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${purchaseMode === 'subscribe_7'
                        ? 'border-primary bg-white shadow-sm'
                        : 'border-transparent bg-white/50 hover:bg-white'
                        }`}
                    >
                      <span className="text-sm font-bold text-text">Deliver every 7 days</span>
                      {purchaseMode === 'subscribe_7' && <span className="text-primary">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurchaseMode('subscribe_30')}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${purchaseMode === 'subscribe_30'
                        ? 'border-primary bg-white shadow-sm'
                        : 'border-transparent bg-white/50 hover:bg-white'
                        }`}
                    >
                      <span className="text-sm font-bold text-text">Deliver every 30 days</span>
                      {purchaseMode === 'subscribe_30' && <span className="text-primary">✓</span>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity + CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <div className="flex items-center justify-between rounded-full border-2 border-cream-dark px-2 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-10 items-center justify-center text-xl text-text-muted"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-10 items-center justify-center text-xl text-text-muted"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={!selectedVariant?.available || adding}
                onClick={() => void addToCart(false)}
                className="flex-1 rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-50"
              >
                {adding ? 'Adding…' : selectedVariant?.available ? 'Add to cart' : 'Sold out'}
              </button>
            </div>

            <button
              type="button"
              disabled={!selectedVariant?.available || adding}
              onClick={() => void addToCart(true)}
              className="mt-3 w-full rounded-full border-2 border-text px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-cream disabled:opacity-50"
            >
              Buy it now
            </button>

            <p className="mt-2 text-center text-lg font-bold text-primary sm:hidden">
              {formatMoney(displayPrice)}
            </p>

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-cream pt-8 sm:grid-cols-4">
              {badges.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full border border-primary/20 text-primary">
                    <TrustBadgeIcon icon={badge.icon} className="size-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase leading-tight tracking-wide text-text">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
