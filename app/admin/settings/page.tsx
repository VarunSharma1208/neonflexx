"use client";

import { useEffect, useState } from "react";
import { SiteSettings } from "@/lib/settings-defaults";
import ImageUpload from "@/components/ImageUpload";

type Tab = "branding" | "announcement" | "hero" | "stats" | "contact" | "theme" | "menu";

const TABS: { key: Tab; label: string }[] = [
  { key: "branding", label: "Branding" },
  { key: "theme", label: "Theme Color" },
  { key: "menu", label: "Menu / Categories" },
  { key: "announcement", label: "Announcement Bar" },
  { key: "hero", label: "Hero Banner" },
  { key: "stats", label: "Stats" },
  { key: "contact", label: "Contact & Footer" },
];

function InputField({
  label, value, onChange, type = "text", placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      />
    </div>
  );
}

function TextareaField({
  label, value, onChange, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>("branding");
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => { if (json.success) setForm(json.data); });
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Website Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded text-sm font-semibold transition-colors ${
            saved
              ? "bg-green-500 text-white"
              : "btn-gold disabled:opacity-60"
          }`}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* BRANDING */}
        {tab === "branding" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-700 mb-4">Brand Identity</h3>

            {/* Logo Upload */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-3">
                Store Logo
              </label>
              <div className="flex items-center gap-6">
                <ImageUpload
                  value={form.logoUrl}
                  onChange={(v) => set("logoUrl", v)}
                  size="lg"
                  shape="square"
                  placeholder="Logo URL ya upload karo"
                />
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Recommended: PNG with transparent background</p>
                  <p>• Width: 300–500px</p>
                  <p>• Logo set hone pe navbar text hide ho jaayega</p>
                  <p>• Remove karo toh store name text dikhega</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Store Name (part 1 — white text)"
                value={form.storeName}
                onChange={(v) => set("storeName", v)}
                placeholder="e.g. NEONFLEXX"
              />
              <InputField
                label="Store Name (part 2 — gold text)"
                value={form.storeNameGold}
                onChange={(v) => set("storeNameGold", v)}
                placeholder="e.g. STUDIO"
              />
            </div>
            <InputField
              label="Tagline (shown below logo in footer)"
              value={form.storeTagline}
              onChange={(v) => set("storeTagline", v)}
              placeholder="e.g. Est. since 1999"
            />
            <TextareaField
              label="Brand Description (footer about text)"
              value={form.storeDescription}
              onChange={(v) => set("storeDescription", v)}
              rows={3}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Certifications (one per line — shown in footer badges)
              </label>
              <textarea
                rows={5}
                value={form.certifications.join("\n")}
                onChange={(e) =>
                  set("certifications", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
                }
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">
                First 5 shown in certifications bar on homepage. First 3 shown as footer badges.
              </p>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENT */}
        {tab === "announcement" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-700 mb-4">Announcement Bar</h3>
            <p className="text-sm text-gray-500">
              The thin bar at the very top of every page (above the navbar).
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => set("announcementEnabled", !form.announcementEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.announcementEnabled ? "bg-gold" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                    form.announcementEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {form.announcementEnabled ? "Visible" : "Hidden"}
              </span>
            </div>
            <TextareaField
              label="Announcement Text"
              value={form.announcementText}
              onChange={(v) => set("announcementText", v)}
              rows={2}
            />
            <div className="bg-[#1a1a1a] text-white text-xs py-2 text-center tracking-widest font-medium rounded">
              Preview: {form.announcementText || "(empty)"}
            </div>
          </div>
        )}

        {/* HERO */}
        {tab === "hero" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-700 mb-4">Hero Banner</h3>
            <p className="text-sm text-gray-500">
              The main hero banner on the homepage (shown when no category is selected).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Title Line 1 (white text)"
                value={form.heroTitle}
                onChange={(v) => set("heroTitle", v)}
                placeholder="e.g. Proton: New Era Of"
              />
              <InputField
                label="Title Line 2 (gold text)"
                value={form.heroTitleGold}
                onChange={(v) => set("heroTitleGold", v)}
                placeholder="e.g. Luxury Fitness"
              />
            </div>
            <TextareaField
              label="Subtitle"
              value={form.heroSubtitle}
              onChange={(v) => set("heroSubtitle", v)}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Primary Button Text"
                value={form.heroBtnPrimary}
                onChange={(v) => set("heroBtnPrimary", v)}
                placeholder="e.g. Explore All"
              />
              <InputField
                label="Secondary Button Text"
                value={form.heroBtnSecondary}
                onChange={(v) => set("heroBtnSecondary", v)}
                placeholder="e.g. Get Quote"
              />
            </div>
            <InputField
              label="Background Image URL"
              value={form.heroBgImage}
              onChange={(v) => set("heroBgImage", v)}
              placeholder="https://..."
            />
            {form.heroBgImage && (
              <div className="rounded overflow-hidden h-32 bg-gray-100">
                <img
                  src={form.heroBgImage}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
            {/* Live preview */}
            <div className="relative bg-[#1a1a1a] rounded overflow-hidden p-6">
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `url('${form.heroBgImage}')`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div className="relative">
                <h1 className="text-2xl font-black text-white leading-tight">
                  {form.heroTitle || "—"}<br />
                  <span style={{ color: "var(--gold)" }}>{form.heroTitleGold || "—"}</span>
                </h1>
                <p className="text-gray-300 text-sm mt-2 max-w-sm">{form.heroSubtitle}</p>
                <div className="flex gap-3 mt-4">
                  <span className="bg-gold text-white text-xs px-4 py-2 rounded font-semibold">
                    {form.heroBtnPrimary || "Button 1"}
                  </span>
                  <span className="border border-white text-white text-xs px-4 py-2 rounded font-semibold">
                    {form.heroBtnSecondary || "Button 2"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-700 mb-1">Stats Section</h3>
            <p className="text-sm text-gray-500 mb-4">
              The dark bar with numbers shown at the bottom of the homepage.
            </p>
            <div className="space-y-3">
              {form.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-5 font-mono">{i + 1}.</span>
                  <input
                    value={stat.num}
                    onChange={(e) => {
                      const updated = [...form.stats];
                      updated[i] = { ...updated[i], num: e.target.value };
                      set("stats", updated);
                    }}
                    placeholder="e.g. 26+"
                    className="w-28 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold font-bold"
                  />
                  <input
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...form.stats];
                      updated[i] = { ...updated[i], label: e.target.value };
                      set("stats", updated);
                    }}
                    placeholder="e.g. Countries"
                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={() => set("stats", form.stats.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => set("stats", [...form.stats, { num: "", label: "" }])}
              className="text-sm text-gold font-semibold hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Stat
            </button>

            {/* Preview */}
            <div className="bg-[#1a1a1a] rounded py-8 px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {form.stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-black" style={{ color: "var(--gold)" }}>{stat.num || "—"}</p>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1">{stat.label || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* THEME */}
        {tab === "theme" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-700 mb-1">Theme Color</h3>
            <p className="text-sm text-gray-500">
              Changes the primary gold/accent color across the entire store — buttons, badges, links, and highlights.
            </p>
            <div className="flex items-center gap-5">
              <div className="relative">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => set("primaryColor", e.target.value)}
                  className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer p-1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hex Code</label>
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) => set("primaryColor", e.target.value)}
                  className="w-36 border border-gray-200 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-gold"
                  placeholder="#C8A84B"
                />
              </div>
            </div>

            {/* Palette presets */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Quick Presets</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { color: "#C8A84B", label: "Gold" },
                  { color: "#2563EB", label: "Blue" },
                  { color: "#16A34A", label: "Green" },
                  { color: "#DC2626", label: "Red" },
                  { color: "#7C3AED", label: "Purple" },
                  { color: "#EA580C", label: "Orange" },
                  { color: "#0891B2", label: "Cyan" },
                  { color: "#1a1a1a", label: "Black" },
                ].map((p) => (
                  <button
                    key={p.color}
                    onClick={() => set("primaryColor", p.color)}
                    title={p.label}
                    className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      form.primaryColor === p.color ? "border-gray-800 scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-5 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Preview</p>
              <button style={{ backgroundColor: form.primaryColor }} className="text-white px-5 py-2 rounded text-sm font-semibold">
                Primary Button
              </button>
              <div className="flex items-center gap-2 mt-3">
                <span style={{ color: form.primaryColor }} className="text-xl font-black">STORE</span>
                <span className="text-xs px-2 py-1 rounded font-bold text-white" style={{ backgroundColor: form.primaryColor }}>BADGE</span>
                <span style={{ color: form.primaryColor }} className="text-sm font-semibold underline">Link text</span>
              </div>
            </div>
          </div>
        )}

        {/* MENU */}
        {tab === "menu" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-700 mb-1">Menu Categories</h3>
            <p className="text-sm text-gray-500">
              Categories appear in the navbar and as circular cards on the homepage. Add a name and a square image URL for each.
            </p>

            <div className="space-y-3">
              {form.categories.map((cat, i) => {
                const catObj = typeof cat === "string" ? { name: cat, image: "" } : cat;
                return (
                  <div key={i} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {/* Inputs */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Category Name</label>
                        <input
                          value={catObj.name}
                          placeholder="e.g. Gaming"
                          onChange={(e) => {
                            const updated = [...form.categories];
                            updated[i] = { ...catObj, name: e.target.value };
                            set("categories", updated);
                          }}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Category Image</label>
                        <ImageUpload
                          value={catObj.image}
                          onChange={(url) => {
                            const updated = [...form.categories];
                            updated[i] = { ...catObj, image: url };
                            set("categories", updated);
                          }}
                          size="sm"
                          shape="circle"
                          placeholder="https://... ya upload karo"
                        />
                      </div>
                    </div>

                    {/* Move + Delete */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          const updated = [...form.categories];
                          updated.splice(i - 1, 2, updated[i], updated[i - 1]);
                          set("categories", updated);
                        }}
                        disabled={i === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...form.categories];
                          updated.splice(i, 2, updated[i + 1], updated[i]);
                          set("categories", updated);
                        }}
                        disabled={i === form.categories.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => set("categories", form.categories.filter((_, idx) => idx !== i))}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => set("categories", [...form.categories, { name: "", image: "" }])}
              className="text-sm text-gold font-semibold hover:underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>
        )}

        {/* CONTACT */}
        {tab === "contact" && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-gray-700 mb-4">Contact & Footer Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Sales Phone"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                placeholder="+91 98765 43210"
              />
              <InputField
                label="WhatsApp Number"
                value={form.whatsapp}
                onChange={(v) => set("whatsapp", v)}
                placeholder="+91 98765 43210"
              />
              <InputField
                label="Sales Email"
                value={form.emailSales}
                onChange={(v) => set("emailSales", v)}
                placeholder="sales@yourstore.com"
              />
              <InputField
                label="Support Email"
                value={form.emailSupport}
                onChange={(v) => set("emailSupport", v)}
                placeholder="support@yourstore.com"
              />
            </div>
            <InputField
              label="GST Number (shown in footer)"
              value={form.gst}
              onChange={(v) => set("gst", v)}
              placeholder="27XXXXX..."
            />
          </div>
        )}
      </div>

      {/* Bottom save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded text-sm font-semibold transition-colors ${
            saved ? "bg-green-500 text-white" : "btn-gold disabled:opacity-60"
          }`}
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
