import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { ThermometerIcon, DropletsIcon, GaugeIcon } from '@/lib/icons';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: t('hero.title') },
        ]}
        title={t('hero.title')}
        description={t('hero.subtitle')}
      />

      {/* Introduction */}
      <section className="py-16">
        <PageContainer size="narrow">
          <h2 className="mb-6 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            {t('introduction.heading')}
          </h2>
          <p className="text-center text-lg leading-relaxed text-neutral-700">
            {t('introduction.description')}
          </p>
        </PageContainer>
      </section>

      {/* Sensor Type Cards */}
      <section className="bg-neutral-50 py-16">
        <PageContainer size="site">
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
        </PageContainer>
      </section>

      {/* Browse Products CTA */}
      <section className="py-16">
        <PageContainer size="narrow" className="text-center">
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
        </PageContainer>
      </section>
    </div>
  );
}
