export interface Category {
  name: string;
  image: string;
}

export interface SiteSettings {
  logoUrl: string;
  storeName: string;
  storeNameGold: string;
  storeTagline: string;
  storeDescription: string;
  announcementEnabled: boolean;
  announcementText: string;
  heroTitle: string;
  heroTitleGold: string;
  heroSubtitle: string;
  heroBtnPrimary: string;
  heroBtnSecondary: string;
  heroBgImage: string;
  stats: { num: string; label: string }[];
  certifications: string[];
  phone: string;
  whatsapp: string;
  emailSales: string;
  emailSupport: string;
  gst: string;
  primaryColor: string;
  categories: Category[];
}

const SHOP_ALL_IMG = "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop";

export const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: "",
  storeName: "NEON",
  storeNameGold: "STUDIO",
  storeTagline: "Light Up Your World",
  storeDescription: "India's premium custom neon sign studio. Handcrafted LED neon lights for homes, businesses, events, and gifting.",
  announcementEnabled: true,
  announcementText: "✦ FREE DELIVERY ABOVE ₹999  ✦  CUSTOM SIGNS IN 5–7 DAYS  ✦  COD AVAILABLE",
  heroTitle: "Light Up Every",
  heroTitleGold: "Moment",
  heroSubtitle: "Custom LED neon signs crafted just for you — homes, cafes, events, and gifts.",
  heroBtnPrimary: "Shop All Signs",
  heroBtnSecondary: "Custom Order",
  heroBgImage: "",
  stats: [
    { num: "5000+", label: "Signs Made" },
    { num: "500+",  label: "Designs" },
    { num: "5–7",   label: "Days Delivery" },
    { num: "100%",  label: "Handcrafted" },
  ],
  certifications: ["LED Neon", "Custom Made", "Pan India Delivery", "COD Available", "5★ Rated"],
  primaryColor: "#00d4ff",
  categories: [
    { name: "Gods",        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&h=300&fit=crop" },
    { name: "Cafe",        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop" },
    { name: "Cricket",     image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&h=300&fit=crop" },
    { name: "Wings",       image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop" },
    { name: "Table Top",   image: SHOP_ALL_IMG },
    { name: "Millionaire", image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=300&h=300&fit=crop" },
    { name: "Love",        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop" },
    { name: "Cars",        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop" },
    { name: "Gaming",      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop" },
    { name: "Gym",         image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop" },
    { name: "Kids",        image: "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=300&h=300&fit=crop" },
    { name: "Diwali",      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=300&fit=crop" },
    { name: "Salon",       image: "https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=300&h=300&fit=crop" },
    { name: "Bar",         image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop" },
    { name: "Wedding",     image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop" },
    { name: "Christmas",   image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300&h=300&fit=crop" },
  ],
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  emailSales: "hello@neonstudio.in",
  emailSupport: "support@neonstudio.in",
  gst: "",
};
