import type { LiquidProduct } from '@/types/shopify';
import { formatMoney } from '@/utils/formatMoney';

interface ProductCardProps {
  product: LiquidProduct;
  onAddToCart?: (product: LiquidProduct) => void;
  showAddButton?: boolean;
}

export function ProductCard({ product, onAddToCart, showAddButton = true }: ProductCardProps) {
  const canAdd =
    (product.variant_available ?? product.available) && Boolean(onAddToCart);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-cream/50 md:rounded-2xl">
      <a href={product.url} className="relative block aspect-square overflow-hidden bg-cream">
        {product.featured_image ? (
          <img
            src={product.featured_image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">No image</div>
        )}
        {!canAdd && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-white md:left-3 md:top-3 md:px-3 md:py-1 md:text-xs">
            Sold out
          </span>
        )}
      </a>
      <div className="flex flex-1 flex-col p-2.5 text-center md:p-5">
        <h3 className="font-heading text-[0.65rem] font-bold uppercase leading-snug tracking-wide text-text md:text-sm">
          <a href={product.url} className="hover:text-primary">
            {product.title}
          </a>
        </h3>
        <p className="mt-1 text-sm font-semibold text-primary md:mt-2 md:text-lg">
          {formatMoney(product.price)}
        </p>
        {showAddButton && canAdd && (
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:opacity-90 md:mt-4 md:px-8 md:py-3 md:text-xs"
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
