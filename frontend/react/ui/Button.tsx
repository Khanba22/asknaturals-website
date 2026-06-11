import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'inverse' | 'outline' | 'cream';

const variantClass: Record<Variant, string> = {
  primary:
    'inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95 hover:opacity-90',
  inverse:
    'inline-flex items-center justify-center rounded-full bg-white px-10 py-3 text-sm font-semibold text-primary transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95 hover:bg-cream',
  outline:
    'inline-flex items-center justify-center rounded-full border-2 border-primary bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 ease-out hover:scale-105 hover:shadow-md active:scale-95 hover:bg-primary/5',
  cream:
    'inline-flex items-center justify-center rounded-full bg-cream px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg active:scale-95 hover:bg-cream-dark',
};

type BaseProps = {
  variant?: Variant;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', className = '', children, ...rest } = props;
  const classes = `${variantClass[variant]} ${className}`.trim();

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as LinkProps;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
