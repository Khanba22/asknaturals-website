import { useEffect, useState } from 'react';

export function useHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;

    const measure = () => setHeaderHeight(header.getBoundingClientRect().height);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(header);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return headerHeight;
}
