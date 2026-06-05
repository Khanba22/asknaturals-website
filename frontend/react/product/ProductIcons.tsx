import type { FC } from 'react';

export function BeakerIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M9 3h6M10 3v4l-5 9a3 3 0 002.6 4.5h9.8A3 3 0 0020 16l-5-9V3" />
    </svg>
  );
}

export function CheckCircleIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

export function FemaleIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" d="M12 12v8M9 18h6" />
    </svg>
  );
}

export function LeafIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M12 21c-4-4-6-8-6-12a6 6 0 0112 0c0 4-2 8-6 12z" />
      <path strokeLinecap="round" d="M12 11V21" />
    </svg>
  );
}

const TRUST_ICONS: Record<string, FC<{ className?: string }>> = {
  beaker: BeakerIcon,
  check: CheckCircleIcon,
  female: FemaleIcon,
  leaf: LeafIcon,
};

export function TrustBadgeIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = TRUST_ICONS[icon] ?? CheckCircleIcon;
  return <Icon className={className} />;
}
