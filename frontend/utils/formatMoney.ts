export function formatMoney(cents: number, format?: string): string {
  const moneyFormat = format ?? window.__SHOPIFY__?.moneyFormat ?? '${{amount}}';
  const amount = (cents / 100).toFixed(2);
  return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, amount);
}
