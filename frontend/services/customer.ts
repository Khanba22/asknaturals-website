import type { CustomerFormError, CustomerOrder } from '@/types/shopify';
import { getRoutes } from '@/utils/routes';
import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';

export class CustomerService {
  getCustomer() {
    return getShopifyBootstrap().customer;
  }

  isLoggedIn(): boolean {
    return this.getCustomer() !== null;
  }

  getAuthenticityToken(): string {
    return getShopifyBootstrap().authenticity_token;
  }

  getAccountUrl(): string {
    return getRoutes().account_url;
  }

  /** New customer accounts: sign in via Shopify-hosted auth, return to storefront. */
  getStorefrontLoginUrl(): string {
    const routes = getRoutes();
    return routes.storefront_login_url || routes.account_login_url;
  }

  /**
   * Sign in and optionally return to a relative storefront path after auth.
   * Never return to auth pages themselves — that causes extra OAuth hops.
   * @see https://shopify.dev/docs/storefronts/themes/sign-in
   */
  getLoginUrl(returnTo?: string): string {
    const authPaths = ['/account/login', '/account/register', '/account/recover', '/account/reset'];
    const isAuthPath =
      returnTo &&
      authPaths.some((path) => returnTo === path || returnTo.startsWith(`${path}?`));

    if (returnTo && !isAuthPath) {
      const routes = getRoutes();
      const path = returnTo.startsWith('/') ? returnTo : `/${returnTo}`;
      const root = routes.root_url.endsWith('/') ? routes.root_url.slice(0, -1) : routes.root_url;
      return `${root}/customer_authentication/login?return_to=${encodeURIComponent(path)}`;
    }

    return this.getStorefrontLoginUrl();
  }

  getOrdersUrl(): string {
    return this.isLoggedIn() ? this.getAccountUrl() : this.getLoginUrl('/account');
  }

  getProfileUrl(): string {
    return this.isLoggedIn()
      ? this.getAddressesUrl()
      : this.getLoginUrl('/account/addresses');
  }

  /** New customer accounts use the same email-code flow for sign up and sign in. */
  getRegisterUrl(returnTo?: string): string {
    return this.getLoginUrl(returnTo);
  }

  getLogoutUrl(): string {
    return getRoutes().account_logout_url;
  }

  getAddressesUrl(): string {
    const routes = getRoutes();
    const [base, query] = routes.account_url.split('?');
    return query ? `${base}/profile?${query}` : `${base}/profile`;
  }

  getRecoverUrl(): string {
    return this.getLoginUrl();
  }

  getResetUrl(): string {
    return getRoutes().account_reset_url;
  }

  getCheckoutUrl(): string {
    const { cart, routes } = getShopifyBootstrap();
    return cart.checkout_url ?? routes.checkout_url;
  }

  /** Orders are passed from Liquid on the account page (not a Storefront API). */
  parseOrdersFromPage(config: { orders?: CustomerOrder[] }): CustomerOrder[] {
    return config.orders ?? [];
  }

  parseFormErrors(config: { form_errors?: CustomerFormError[] }): CustomerFormError[] {
    return config.form_errors ?? [];
  }
}

export const customerService = new CustomerService();
