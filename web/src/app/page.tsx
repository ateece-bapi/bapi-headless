import Link from 'next/link';
import Hero from './components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="w-32 h-24 bg-neutral-100 rounded mb-4 flex items-center justify-center">
                <span className="text-4xl text-neutral-300">📦</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Product Name {i}</h3>
              <p className="text-neutral-500 mb-4 text-center">Short product description goes here.</p>
              <span className="font-bold text-blue-700 text-xl mb-4">$XXX.00</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions / Industries Served */}
      <section className="w-full bg-neutral-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Industries & Solutions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {['Commercial Buildings', 'Healthcare', 'Manufacturing', 'Data Centers'].map((industry, idx) => (
              <div key={industry} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-4xl mb-4">🏢</span>
                <h3 className="font-semibold text-lg mb-2">{industry}</h3>
                <p className="text-neutral-500 text-center">Brief description of how BAPI serves this industry.</p>
                <Link href="/solutions" className="mt-4 text-blue-600 hover:underline font-medium">Learn more</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            {icon: '🛡️', title: 'Professional Grade', desc: 'Industry-leading sensors and control modules.'},
            {icon: '🔌', title: 'Easy Integration', desc: 'BACnet, Modbus, and wireless connectivity.'},
            {icon: '🤝', title: 'Reliable Support', desc: 'Expert technical assistance when you need it.'},
            {icon: '🌱', title: 'Sustainability', desc: 'Committed to sustainable and efficient solutions.'},
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
              <span className="text-4xl mb-4">{item.icon}</span>
              <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
              <p className="text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals / Customer Stories */}
      <section className="w-full bg-neutral-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Trusted by Industry Leaders</h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {["Siemens", "Honeywell", "Schneider Electric", "Johnson Controls", "ABB", "Rockwell Automation"].map((logo) => (
              <div key={logo} className="bg-white rounded shadow p-6 flex items-center justify-center min-w-[160px] min-h-[80px] text-xl font-bold text-neutral-400">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Insights */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">News & Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col">
              <div className="h-32 bg-neutral-100 rounded mb-4 flex items-center justify-center">
                <span className="text-3xl text-neutral-300">📰</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">News Headline {i}</h3>
              <p className="text-neutral-500 mb-4">Short summary of the news or blog post goes here.</p>
              <Link href="/news" className="text-blue-600 hover:underline font-medium mt-auto">Read more</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="w-full bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-lg text-blue-100 mb-8">Contact our team or browse our products to find the right solution for your building automation needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white hover:bg-blue-50 text-blue-700 px-8 py-3 rounded font-semibold text-lg shadow transition">Contact Sales</Link>
            <Link href="/products" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded font-semibold text-lg shadow transition">Browse Products</Link>
          </div>
        </div>
      </section>
    </main>
  );
}