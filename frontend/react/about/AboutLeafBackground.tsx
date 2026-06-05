export function AboutLeafBackground({ imageUrl }: { imageUrl?: string | null }) {
  if (!imageUrl) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <img
        src={imageUrl}
        alt=""
        className="absolute left-1/2 top-1/2 h-[120%] w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.12]"
      />
    </div>
  );
}
