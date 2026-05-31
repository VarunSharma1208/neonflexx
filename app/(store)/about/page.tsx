import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Hero */}
      <div className="relative bg-[#080808] border-b border-[rgba(0,212,255,0.1)] py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <p className="text-[#00d4ff] text-xs uppercase tracking-[0.4em] font-bold mb-3 opacity-70">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            About <span className="gold-text neon-glow neon-flicker">Neon Studio</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            We craft premium LED neon signs that bring personality, warmth, and light to every space.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Who we are */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#00d4ff] text-xs uppercase tracking-widest font-bold mb-3">Who We Are</p>
            <h2 className="text-3xl font-black text-white mb-5">Handcrafted with passion, delivered with pride</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Neon Studio was born from a simple belief — every space tells a story, and light is its language. We started as a small studio with a big dream: to make custom neon signs accessible to every home, cafe, salon, and event across India.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, we have crafted over 5,000 signs that glow in homes, businesses, weddings, and festivals across the country. Every sign is handmade with care, using premium LED neon flex on high-quality acrylic.
            </p>
          </div>
          <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-8 text-center">
            <p className="text-6xl font-black text-[#00d4ff] neon-glow mb-1">5000+</p>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Signs Crafted</p>
            <div className="w-16 h-px bg-[rgba(0,212,255,0.2)] mx-auto my-6" />
            <p className="text-4xl font-black text-white mb-1">100%</p>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Handmade</p>
          </div>
        </div>

        {/* Values */}
        <div>
          <p className="text-[#00d4ff] text-xs uppercase tracking-widest font-bold mb-3 text-center">What We Stand For</p>
          <h2 className="text-3xl font-black text-white mb-10 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "✦",
                title: "Quality First",
                desc: "We use only premium LED neon flex — low heat, long life, vibrant glow. Every sign is tested before it leaves our studio.",
              },
              {
                icon: "✦",
                title: "Made For You",
                desc: "No two customers are the same. Whether it's your name, your brand, or a quote that moves you — we bring your vision to life.",
              },
              {
                icon: "✦",
                title: "Delivered Fast",
                desc: "Custom signs ready in 5–7 days. Ready-made signs ship within 24 hours. Pan India delivery with real-time tracking.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.1)] rounded-2xl p-6 hover:border-[rgba(0,212,255,0.3)] transition-colors">
                <span className="text-[#00d4ff] text-2xl block mb-4 neon-glow">{v.icon}</span>
                <h3 className="text-white font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "5000+", label: "Signs Made" },
              { num: "500+",  label: "Designs" },
              { num: "5–7",   label: "Days Delivery" },
              { num: "5★",    label: "Customer Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-[#00d4ff] neon-glow">{s.num}</p>
                <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-4">Ready to light up your space?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/custom" className="btn-gold px-8 py-3 rounded text-sm uppercase tracking-widest inline-block">
              Design Your Sign
            </Link>
            <Link href="/" className="border border-[rgba(0,212,255,0.3)] text-[#00d4ff] px-8 py-3 rounded text-sm uppercase tracking-widest inline-block hover:border-[#00d4ff] transition-colors">
              Shop Collection
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
