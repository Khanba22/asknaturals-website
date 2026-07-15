import { useState } from 'react';
import type { CategoriesSettings } from '@/types/section-settings';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';
import { rotateIn } from './motion/variants';

const ICONS: Record<string, string> = {
  pcos: '◉',
  hormones: '♡',
  digestion: '◎',
  metabolism: '⚡',
  energy: '☀',
  immunity: '🛡',
  sleep: '☾',
  fatloss: '↓',
  beauty: '✦',
  stress: '〜',
  menopause: '🌿',
  other: '•',
};

interface CategoriesProps {
  settings: CategoriesSettings;
}

export function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          className="relative w-full max-w-xs rounded-2xl bg-white px-6 py-8 text-center shadow-xl"
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Coming Soon
          </p>
          <p className="mb-6 text-sm leading-relaxed text-text-muted">
            We&apos;re working on something thoughtful. Check back soon.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            Okay
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Categories({ settings }: CategoriesProps) {
  const blocks = settings.blocks ?? [];
  const [showModal, setShowModal] = useState(false);

  const handleClick = (link?: string | null) => {
    if (link) {
      window.location.href = link;
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            {settings.heading && (
              <h2 className="mb-5 font-bold uppercase leading-tight tracking-wide text-primary text-2xl md:text-3xl">
                {settings.heading}
              </h2>
            )}
            {settings.subheading && (
              <p className="text-base leading-relaxed text-text-muted md:text-lg">
                {settings.subheading}
              </p>
            )}
          </Reveal>

          <Stagger className="flex flex-wrap items-center justify-evenly gap-8">
            {blocks.map((block) => {
              const { title, icon, icon_url, link } = block.settings as {
                title?: string;
                icon?: string;
                icon_url?: string;
                link?: string | null;
              };
              return (
                <StaggerItem key={block.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(link)}
                    className="group flex flex-col items-center justify-center gap-0 cursor-pointer focus:outline-none"
                    aria-label={title}
                  >
                    <motion.div
                      variants={rotateIn}
                      className="mb-4 size-20 overflow-hidden rounded-full"
                    >
                      <img
                        src={icon_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                    {title && (
                      <h3 className="text-center text-sm font-bold uppercase tracking-wide text-primary transition-opacity duration-200 group-hover:opacity-70">
                        {title}
                      </h3>
                    )}
                  </button>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
