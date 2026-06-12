import { useMemo, useState } from 'react';
import type { ProductDetailSettings, ProductVariant } from '@/types/product-sections';
import { formatMoney } from '@/utils/formatMoney';
import { cartService } from '@/services/cart';
import { customerService } from '@/services/customer';
import { dispatchOpenCart } from '@/utils/events';
import { TrustBadgeIcon } from './ProductIcons';

interface MainProductProps {
  settings: ProductDetailSettings;
}

type PurchaseMode = 'subscribe' | 'onetime';

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
  { label: 'Ayurvedic Blend', icon: 'leaf' },
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
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('subscribe');
  const [adding, setAdding] = useState(false);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId],
  );

  const { subscribePrice, onetimePrice } = getVariantPrices(selectedVariant, settings);
  const displayPrice = purchaseMode === 'subscribe' ? subscribePrice : onetimePrice;

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
                    className={`size-16 overflow-hidden rounded-xl border-2 transition ${activeImage === index ? 'border-primary' : 'border-transparent opacity-70'
                      }`}
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl bg-cream">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-cover"
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
                    className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
                    aria-label="Next image"
                  >
                    ›
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
                  const { onetimePrice: variantOnetimePrice } = getVariantPrices(variant, settings);
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
                          {formatMoney(variantOnetimePrice)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Purchase options */}
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setPurchaseMode('subscribe')}
                className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition ${purchaseMode === 'subscribe'
                  ? 'border-primary bg-primary/5'
                  : 'border-cream-dark bg-white'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      Subscribe &amp; Save
                    </p>
                    <p className="mt-1 text-sm text-text-muted">Delivered every 30 days</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatMoney(subscribePrice)}</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPurchaseMode('onetime')}
                className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition ${purchaseMode === 'onetime'
                  ? 'border-primary bg-primary/5'
                  : 'border-cream-dark bg-white'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    One-Time Purchase
                  </p>
                  <p className="text-lg font-bold text-primary">{formatMoney(onetimePrice)}</p>
                </div>
              </button>
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
