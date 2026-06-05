interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

/** Fallback wordmark when no logo image is uploaded in theme settings */
export function BrandLogo({ className = '', variant = 'light' }: BrandLogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-primary';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold tracking-[0.2em] ${textColor} ${className}`}
      aria-label="AskNatural"
    >
      <span className="text-sm md:text-base">ASKK</span>
      <svg
        className="h-5 w-5 shrink-0 md:h-6 md:w-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M6 14h2v4H6v-4zm10 0h2v4h-2v-4zM4 10h16v2H4v-2zm2-4h2v3H6V6zm10 0h2v3h-2V6z" />
      </svg>
      <span className="text-sm md:text-base">NATURAL</span>
    </span>
  );
}
