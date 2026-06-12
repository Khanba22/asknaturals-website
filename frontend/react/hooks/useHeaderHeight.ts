import { useEffect, useState } from 'react';

const HEIGHT_EPSILON = 2;

export function useHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    let debounceTimer = 0;

    const measure = () => {
      const next = Math.round(header.getBoundingClientRect().height);
      setHeaderHeight((prev) => (Math.abs(prev - next) <= HEIGHT_EPSILON ? prev : next));
    };

    const scheduleMeasure = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(measure, 120);
    };

    measure();

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(header);
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      window.clearTimeout(debounceTimer);
      observer.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, []);

  return headerHeight;
}
