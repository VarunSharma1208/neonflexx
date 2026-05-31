import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Choose or Design",
    desc: "Browse our ready-made collection or use our Custom Sign Builder to create your own — pick your text, font, color, and size.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Confirm & Pay",
    desc: "Place your order with COD or online payment. For custom signs, our team calls you within 24 hours to confirm all details.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Handcrafted for You",
    desc: "Our artisans handcraft your neon sign using premium LED flex on high-quality acrylic. Each sign is tested before packing.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Delivered to Your Door",
    desc: "Your neon sign is securely packed and shipped Pan India. Track your order in real-time. Ready-made ships in 24hrs, custom in 5–7 days.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
];

const FAQS = [
  { q: "How long does a custom sign take?", a: "Custom signs are ready in 5–7 business days after design confirmation. Ready-made signs ship within 24 hours." },
  { q: "Are the signs safe to use indoors?", a: "Yes! All our signs use LED neon flex which runs cool, consumes low power, and is completely safe for homes, kids' rooms, and businesses." },
  { q: "Can I use my own logo or font?", a: "Absolutely. Use our Custom Sign Builder or WhatsApp us your design. We support any text, custom fonts, and logo-based neon signs." },
  { q: "Do you offer COD?", a: "Yes, Cash on Delivery is available across India. You can also pay online at checkout." },
  { q: "What if my sign arrives damaged?", a: "Every sign is packed carefully but if anything goes wrong in transit, contact us within 48 hours with photos. We will replace it free of charge." },
  { q: "What sizes are available?", a: "We offer Small (~30cm), Medium (~50cm), Large (~80cm), and XL (~100cm). Custom sizes are also available on request." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Header */}
      <div className="bg-[#080808] border-b border-[rgba(0,212,255,0.1)] py-20 text-center">
        <p className="text-[#00d4ff] text-xs uppercase tracking-[0.4em] font-bold mb-3 opacity-70">Simple Process</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          How It <span className="gold-text neon-glow neon-flicker">Works</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-lg">From your idea to a glowing sign on your wall — in 4 easy steps.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.step}
              className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-8 hover:border-[rgba(0,212,255,0.35)] transition-colors relative overflow-hidden">
              {/* Step number watermark */}
              <span className="absolute top-4 right-6 text-7xl font-black text-white/[0.03] select-none">{s.step}</span>
              <div className="text-[#00d4ff] mb-4">{s.icon}</div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-[#00d4ff] bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] px-2 py-0.5 rounded">
                  Step {s.step}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#00d4ff] text-xl">→</div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.15)] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Ready to get started?</h2>
          <p className="text-gray-500 mb-6">Design your sign now or browse our collection.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/custom" className="btn-gold px-8 py-3 rounded text-sm uppercase tracking-widest inline-block">
              Build Your Sign
            </Link>
            <Link href="/" className="border border-[rgba(0,212,255,0.3)] text-[#00d4ff] px-8 py-3 rounded text-sm uppercase tracking-widest inline-block hover:border-[#00d4ff] transition-colors">
              Browse Collection
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <p className="text-[#00d4ff] text-xs uppercase tracking-widest font-bold mb-3 text-center">Got Questions?</p>
          <h2 className="text-3xl font-black text-white mb-10 text-center">Frequently Asked</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q}
                className="bg-[#0d0d0d] border border-[rgba(0,212,255,0.1)] rounded-xl group open:border-[rgba(0,212,255,0.3)] transition-colors">
                <summary className="px-6 py-4 cursor-pointer text-white font-semibold text-sm flex items-center justify-between list-none">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform shrink-0"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
