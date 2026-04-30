import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ThermometerIcon, DropletsIcon, GaugeIcon } from '@/lib/icons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sensorSpecsPage.metadata' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SensorSpecsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'sensorSpecsPage' });
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 py-20 text-white">
        {/* Background Pattern (optional) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ThermometerIcon className="mx-auto mb-6 h-20 w-20 text-primary-50" />
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-content text-xl text-primary-50 sm:text-2xl">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            {t('introduction.heading')}
          </h2>
          <p className="text-center text-lg leading-relaxed text-neutral-700">
            {t('introduction.description')}
          </p>
        </div>
      </section>

      {/* Sensor Type Cards */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Thermistors */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">{t('sensorTypes.thermistors.title')}</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                {t('sensorTypes.thermistors.description')}
              </p>
              <Link
                href="/sensor-specs/thermistor"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                {t('sensorTypes.thermistors.buttonText')}
              </Link>
            </div>

            {/* RTDs */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">{t('sensorTypes.rtds.title')}</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                {t('sensorTypes.rtds.description')}
              </p>
              <Link
                href="/sensor-specs/rtd"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                {t('sensorTypes.rtds.buttonText')}
              </Link>
            </div>

            {/* Semiconductors */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">{t('sensorTypes.semiconductors.title')}</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                {t('sensorTypes.semiconductors.description')}
              </p>
              <Link
                href="/sensor-specs/semiconductor"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                {t('sensorTypes.semiconductors.buttonText')}
              </Link>
            </div>

            {/* Temperature Transmitters */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <ThermometerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">{t('sensorTypes.temperatureTransmitters.title')}</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                {t('sensorTypes.temperatureTransmitters.description')}
              </p>
              <Link
                href="/sensor-specs/temperature-transmitters"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                {t('sensorTypes.temperatureTransmitters.buttonText')}
              </Link>
            </div>

            {/* Humidity Transmitters */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <DropletsIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">{t('sensorTypes.humidityTransmitters.title')}</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                {t('sensorTypes.humidityTransmitters.description')}
              </p>
              <Link
                href="/sensor-specs/humidity-transmitters"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                {t('sensorTypes.humidityTransmitters.buttonText')}
              </Link>
            </div>

            {/* Pressure Transmitters */}
            <div className="group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition-all hover:border-primary-500 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                <GaugeIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-neutral-900">{t('sensorTypes.pressureTransmitters.title')}</h3>
              <p className="mb-6 flex-grow text-neutral-700">
                {t('sensorTypes.pressureTransmitters.description')}
              </p>
              <Link
                href="/sensor-specs/pressure-transmitters"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700 group-hover:shadow-md"
              >
                {t('sensorTypes.pressureTransmitters.buttonText')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Products CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-12 shadow-xl">
            <ThermometerIcon className="mx-auto mb-6 h-16 w-16 text-white" />
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t('cta.title')}
            </h2>
            <p className="mb-8 text-lg text-primary-50">
              {t('cta.description')}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-primary-700 transition-all hover:bg-primary-50 hover:shadow-lg"
            >
              {t('cta.buttonText')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
