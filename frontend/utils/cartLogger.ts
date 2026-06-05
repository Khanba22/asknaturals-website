/** Cart API request/response logging (on by default during integration). */
export function isCartDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('asknatural:debug:cart') === '0') return false;
  } catch {
    // ignore
  }
  return true;
}

export function logCart(scope: string, data: unknown): void {
  if (!isCartDebugEnabled()) return;
  console.info(`[Cart API] ${scope}`, data);
}

export async function readResponseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
