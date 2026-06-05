import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import '@/tailwind/index.css';
import { parseLiquidConfig } from '@/utils/liquidConfig';
import { Hero } from '@/react/Hero';
import { Categories } from '@/react/Categories';
import { Showcase } from '@/react/Showcase';
import { Features } from '@/react/Features';
import { Testimonials } from '@/react/Testimonials';
import { Footer } from '@/react/Footer';
import { Header } from '@/react/Header';
import { ProductGrid } from '@/react/ProductGrid';
import { CartDrawer } from '@/react/CartDrawer';
import { MainProduct } from '@/react/MainProduct';
import { FeaturedProduct } from '@/react/FeaturedProduct';
import { TrustQuality } from '@/react/TrustQuality';
import { WellnessQuiz } from '@/react/WellnessQuiz';
import { Stats } from '@/react/Stats';
import { Founder } from '@/react/Founder';
import { CustomerLogin } from '@/react/CustomerLogin';
import { CustomerRegister } from '@/react/CustomerRegister';
import { CustomerAccount } from '@/react/CustomerAccount';
import { CustomerActivate } from '@/react/CustomerActivate';
import { CustomerResetPassword } from '@/react/CustomerResetPassword';
import { CartPage } from '@/react/CartPage';
import { SearchPage } from '@/react/SearchPage';
import { NotFound } from '@/react/NotFound';
import { PageContent } from '@/react/PageContent';
import { ListCollections } from '@/react/ListCollections';
import { CustomerAddresses } from '@/react/CustomerAddresses';
import { CustomerOrder } from '@/react/CustomerOrder';
import { ProductAccordion } from '@/react/product/ProductAccordion';
import { ProductStorySplit } from '@/react/product/ProductStorySplit';
import { ProductIngredients } from '@/react/product/ProductIngredients';
import { ProductLabVerified } from '@/react/product/ProductLabVerified';
import { ProductFaq } from '@/react/product/ProductFaq';
import { AboutHero } from '@/react/about/AboutHero';
import { AboutSplit } from '@/react/about/AboutSplit';
import { AboutApproach } from '@/react/about/AboutApproach';
import { AboutVision } from '@/react/about/AboutVision';
import { AboutFounderQuote } from '@/react/about/AboutFounderQuote';
import { AboutCta } from '@/react/about/AboutCta';
import { ContactPage } from '@/react/contact/ContactPage';
import { ContactFaq } from '@/react/contact/ContactFaq';

const registry: Record<string, ComponentType<{ settings: unknown }>> = {
  Hero,
  Categories,
  Showcase,
  Features,
  Testimonials,
  Footer,
  Header,
  ProductGrid,
  CartDrawer,
  MainProduct,
  FeaturedProduct,
  TrustQuality,
  WellnessQuiz,
  Stats,
  Founder,
  CustomerLogin,
  CustomerRegister,
  CustomerAccount,
  CustomerActivate,
  CustomerResetPassword,
  CartPage,
  SearchPage,
  NotFound,
  PageContent,
  ListCollections,
  CustomerAddresses,
  CustomerOrder,
  ProductAccordion,
  ProductStorySplit,
  ProductIngredients,
  ProductLabVerified,
  ProductFaq,
  AboutHero,
  AboutSplit,
  AboutApproach,
  AboutVision,
  AboutFounderQuote,
  AboutCta,
  ContactPage,
  ContactFaq,
};

type RegistryKey = keyof typeof registry;

function mountIslands() {
  document.querySelectorAll<HTMLElement>('[data-react-root]').forEach((el) => {
    const name = el.getAttribute('data-react-root') as RegistryKey | null;
    if (!name || !(name in registry)) {
      console.warn(`Unknown React island: ${name}`);
      return;
    }
    const Component = registry[name];
    const settings = parseLiquidConfig(el);
    createRoot(el).render(<Component settings={settings} />);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountIslands);
} else {
  mountIslands();
}
