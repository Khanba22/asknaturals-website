# AskNatural store setup checklist

Complete these steps in **ask-naturals** admin (or your target store) to run as a real shop.

## 1. Enable customer accounts

**Settings → Customer accounts**

- Choose **Accounts are optional** or **Accounts are required**
- Select **Classic customer accounts** (required for custom order history & order summary pages in this theme)
- Save

> **Important:** Custom order UI at `/account` and `/account/orders/{id}` only works with **Classic customer accounts**. If you use **New customer accounts**, Shopify hosts orders on its own portal and the theme cannot replace that UI.

Sign-in uses Shopify’s flow (`routes.storefront_login_url`). When logged out, **My account**, **Orders**, and **Profile** in the header all go to sign-in first (not the slow hosted portal).

### Preview order pages in the theme editor

1. **Online Store → Themes → Customize**
2. Page selector → **Legacy customer accounts**
3. Choose **Customer account** (order history) or **Customer order** (order summary)
4. Preview while logged in as a customer with at least one order

## 2. Navigation menu

**Online Store → Navigation → Main menu**

Add links matching the design:

| Title | URL |
|-------|-----|
| Our Products | `/collections/all` |
| Shop | `/collections/all` |
| About | `/pages/about` |
| Lab Reports | `/pages/lab-reports` |
| Subscribe | `/pages/subscribe` |
| Contact | `/pages/contact` |

Assign **Main menu** in **Theme editor → Header**.

## 3. Brand assets

**Theme settings → Brand**

- Upload a **white/light logo** for the dark green header (`logo`)
- Upload favicon

**Theme settings → Colors** — defaults match mockups (`#2D4F1E`, cream `#F5F1EB`).

## 4. Homepage content

**Theme editor → Homepage**

- **Hero** — upload hero image (woman + botanical background)
- **Featured product** — pick a product (e.g. PCOS Hot Chocolate)
- **Product grid** — select your main collection

## 5. Products & checkout

- Add products with images and prices in **Products**
- **Settings → Payments** — enable Shopify Payments or test mode
- **Settings → Shipping** — configure rates

**Order flow (no custom Order API):**

1. Add to cart (Ajax API)
2. Cart drawer → **Checkout**
3. Shopify Checkout completes the order
4. Logged-in customers see orders under **Account**

## 6. Storefront API (optional)

For client-side product search/enhancement:

**Theme settings → Storefront API** → paste public token from a custom app.

## 7. Policies

**Settings → Policies** — fill Privacy, Refund, Shipping, Terms (footer links auto-populate).

## 8. Theme pages (React)

These templates use the same header/footer and brand styling as the homepage:

| Page | URL | Template |
|------|-----|----------|
| Cart | `/cart` | `cart.json` |
| Search | `/search?q=…` | `search.json` |
| 404 | (any missing URL) | `404.json` |
| Collections index | `/collections` | `list-collections.json` |
| Generic page | `/pages/…` | `page.json` |
| Login | `/account/login` | `customers/login.json` → sign-in redirect |
| Register | `/account/register` | `customers/register.json` → sign-in redirect |
| **Order history** | `/account` | `customers/account.json` → `OrderListPage` |
| **Order summary** | `/account/orders/…` | `customers/order.json` → `OrderStatusPage` |
| Addresses | `/account/addresses` | `customers/addresses.json` |

**Theme editor:** Customize → **Legacy customer accounts** → Customer account / Customer order.

**Checkout** is always Shopify-hosted (`/checkout`) — the cart drawer and cart page link there via `checkout_url`.

## 9. Push theme

Deploy customer account auth and portal redirects together with built assets:

```bash
npm run build
shopify theme push -s ask-naturals.myshopify.com --unpublished --theme "AskNatural React"
```

**Include these paths:**

- `layout/theme.liquid` (includes `storefront_login_url`)
- `sections/react-customer-login.liquid`
- `sections/react-customer-register.liquid`
- `sections/react-customer-account.liquid`
- `sections/react-customer-order.liquid`
- `assets/app.js` and `assets/app.css`

Publish when ready: **Online Store → Themes → Publish**.

**Smoke test after deploy:**

1. Click **Sign in** in the header — should use email verification (not a password form posting to `shop.app`)
2. Complete sign-in — should land back on the storefront or account portal
3. Click **Orders** / **My account** — should open Shopify customer account portal

## 10. Cart add returns 422 “already sold out”

If the browser console shows `POST /cart/add.js` with the correct **variant** id (not product id) and Shopify still returns 422, the theme request is fine — Shopify is blocking purchase on the storefront.

**Verify in the browser** (on the storefront, while logged in if the shop is password-protected):

```js
// Should match the variant id on the product card
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ items: [{ id: 47318824059065, quantity: 1 }] }),
}).then((r) => r.json()).then(console.log);

// Compare Liquid vs Ajax product data
fetch('/products/a-dummy-product-from-asknaturls.js')
  .then((r) => r.json())
  .then((p) => console.log(p.variants.find((v) => v.id === 47318824059065)));
```

**Admin checklist**

| Check | Where |
|-------|--------|
| Product **Active** | Products → product status |
| **Online Store** channel on product and variant | Product → Publishing / “Manage publishing” per variant; variant row must not show **None** for Online Store |
| Inventory at a location that fulfills online orders | Products → variant inventory; **Settings → Locations** → location used for online fulfillment is active |
| Market includes the product | **Settings → Markets** → market your customers use → Products |
| Shipping from that location | **Settings → Shipping and delivery** |
| Stale cart state after failed adds | Clear cart (drawer or `/cart/clear`) and retry |

After changing publishing or inventory, wait 1–2 minutes and hard-refresh the storefront. Liquid `variant.available` can stay `true` while the cart API still returns sold out until channels, markets, and fulfillment locations align.
