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

  getLoginUrl(returnTo?: string): string {
    const url = getRoutes().account_login_url;
    if (returnTo) {
      return `${url}?return_url=${encodeURIComponent(returnTo)}`;
    }
    return url;
  }

  getRegisterUrl(): string {
    return getRoutes().account_register_url;
  }

  getLogoutUrl(): string {
    return getRoutes().account_logout_url;
  }

  getAddressesUrl(): string {
    return getRoutes().account_addresses_url;
  }

  getRecoverUrl(): string {
    return getRoutes().account_recover_url;
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
