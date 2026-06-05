/**
 * Reads JSON from data-config (Liquid outputs via json + escape in double-quoted attr).
 * Single-quoted attrs break on apostrophes in merchant copy e.g. "women's".
 */
export function parseLiquidConfig<T>(element: Element): T {
  const raw = element.getAttribute('data-config');
  if (!raw) {
    return {} as T;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (firstError) {
    try {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = raw;
      return JSON.parse(textarea.value) as T;
    } catch {
      console.error('Failed to parse data-config', firstError, raw.slice(0, 200));
      return {} as T;
    }
  }
}
