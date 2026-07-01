import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hero } from './index';

/**
 * Hero Stories
 *
 * Homepage hero section — the above-the-fold entry point for every visitor.
 * Highest visual regression risk: changes here affect all users immediately.
 *
 * The Hero accepts a `translations` prop (passed from the locale layout),
 * making it fully testable without next-intl hooks.
 *
 * Stories:
 * - English (default): Primary English content
 * - Spanish: Tests font rendering and longer strings
 * - Mobile: 375px viewport where background image is replaced by solid color
 */

const enTranslations = {
  title: 'Building Automation Products, Engineered for Reliability',
  description:
    'BAPI manufactures precision sensors and transmitters for HVAC, building automation, and industrial control applications. Trusted by engineers worldwide since 1993.',
  cta: 'Browse Products',
  secondaryCta: 'Contact Us',
  productFamilyTitle: 'Precision Sensing Solutions',
  productFamilySubtitle: 'Temperature · Humidity · Pressure · CO₂',
  taglines: [
    'Trusted by engineers for 30+ years',
    'ISO 9001 certified manufacturing',
    'Same-day shipping available',
    'BACnet & Modbus compatible',
  ],
};

const esTranslations = {
  title: 'Productos de Automatización de Edificios, Ingeniería para la Confiabilidad',
  description:
    'BAPI fabrica sensores y transmisores de precisión para aplicaciones de climatización, automatización de edificios y control industrial. Confiado por ingenieros en todo el mundo desde 1993.',
  cta: 'Ver Productos',
  secondaryCta: 'Contáctenos',
  productFamilyTitle: 'Soluciones de Detección de Precisión',
  productFamilySubtitle: 'Temperatura · Humedad · Presión · CO₂',
  taglines: [
    'Confiado por ingenieros por más de 30 años',
    'Fabricación certificada ISO 9001',
    'Envío el mismo día disponible',
    'Compatible con BACnet y Modbus',
  ],
};

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Homepage hero section. Above-the-fold — highest visual regression priority. Accepts a `translations` prop for i18n support. Background image is hidden on mobile (solid color instead) and shown on desktop.',
      },
    },
    chromatic: { delay: 300 }, // Allow TaglineRotator transitions to settle
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

/** English — primary locale. */
export const English: Story = {
  args: {
    translations: enTranslations,
  },
};

/** Spanish — tests font metrics with longer translated strings. */
export const Spanish: Story = {
  args: {
    translations: esTranslations,
  },
};

/** Mobile viewport — background image is hidden, solid neutral-100 background. */
export const Mobile: Story = {
  args: {
    translations: enTranslations,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375], delay: 300 },
  },
};
