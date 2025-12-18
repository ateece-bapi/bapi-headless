import Link from 'next/link';
import Hero from './components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products - White */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center border border-neutral-100">
                <div className="w-32 h-24 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl text-neutral-400">📦</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Product Name {i}</h3>
                <p className="text-neutral-600 mb-4 text-center text-sm">Short product description goes here.</p>
                <span className="font-bold text-[#0054b6] text-xl mb-4">$XXX.00</span>
                <button className="w-full bg-[#0054b6] hover:bg-[#003d85] text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions / Industries Served - Light Blue Gradient */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-16 sm:py-20 lg:py-24 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900">
            Industries & Solutions
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Trusted by professionals across multiple industries for reliable building automation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {['Commercial Buildings', 'Healthcare', 'Manufacturing', 'Data Centers'].map((industry) => (
              <div key={industry} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center border border-blue-100 hover:border-blue-200 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0054b6] to-[#1479bc] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🏢</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 text-center">{industry}</h3>
                <p className="text-neutral-600 text-center text-sm mb-4">
                  Brief description of how BAPI serves this industry.
                </p>
                <Link href="/solutions" className="text-[#0054b6] hover:text-[#003d85] font-semibold hover:underline transition-colors">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions - White */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900">
            Why Choose BAPI?
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Decades of experience delivering precision solutions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {icon: '🛡️', title: 'Professional Grade', desc: 'Industry-leading sensors and control modules.'},
              {icon: '🔌', title: 'Easy Integration', desc: 'BACnet, Modbus, and wireless connectivity.'},
              {icon: '🤝', title: 'Reliable Support', desc: 'Expert technical assistance when you need it.'},
              {icon: '🌱', title: 'Sustainability', desc: 'Committed to sustainable and efficient solutions.'},
            ].map((item) => (
              <div key={item.title} className="bg-gradient-to-br from-white to-neutral-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center border border-neutral-100 hover:border-[#ffc843] group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ffc843] to-[#ffb700] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900 text-center">{item.title}</h4>
                <p className="text-neutral-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals - Light Yellow/Neutral Gradient */}
      <section className="w-full bg-gradient-to-br from-amber-50/30 via-white to-neutral-50 py-16 sm:py-20 lg:py-24 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900">
            Trusted by Industry Leaders
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Partnerships with the world's leading building automation companies
          </p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {["Siemens", "Honeywell", "Schneider Electric", "Johnson Controls", "ABB", "Rockwell Automation"].map((logo) => (
              <div key={logo} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 flex items-center justify-center min-w-[180px] min-h-[100px] border border-neutral-200 hover:border-[#0054b6] group">
                <span className="text-xl font-bold text-neutral-400 group-hover:text-[#0054b6] transition-colors">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Insights - White */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900">
            News & Insights
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Stay updated with the latest in building automation technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <article key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100 hover:border-[#0054b6] group">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <span className="text-5xl text-blue-300">📰</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-[#0054b6] transition-colors">
                    News Headline {i}
                  </h3>
                  <p className="text-neutral-600 mb-4 text-sm">
                    Short summary of the news or blog post goes here with engaging content.
                  </p>
                  <Link href="/news" className="text-[#0054b6] hover:text-[#003d85] font-semibold hover:underline transition-colors inline-flex items-center">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner - Blue Gradient */}
      <section className="w-full bg-gradient-to-br from-[#0054b6] via-[#1479bc] to-[#0054b6] py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,200,67,0.1)_0%,transparent_50%)]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Contact our team or browse our products to find the right solution for your building automation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-blue-50 text-[#0054b6] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Contact Sales
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 bg-[#ffc843] hover:bg-[#ffb700] text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}