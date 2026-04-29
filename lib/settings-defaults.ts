export interface SiteSettings {
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
  categories: string[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "JERAI",
  storeNameGold: "FITNESS",
  storeTagline: "Est. since 1999",
  storeDescription:
    "India's premier fitness equipment manufacturer. Supplying professional-grade equipment to 26 countries worldwide. Reebok certified partner.",
  announcementEnabled: true,
  announcementText: "ISO 9001:2015 CERTIFIED  |  PAN INDIA DELIVERY  |  +91 8657964733",
  heroTitle: "Proton: New Era Of",
  heroTitleGold: "Luxury Fitness",
  heroSubtitle: "Professional fitness equipment trusted by 26 countries. Reebok certified partner.",
  heroBtnPrimary: "Explore All",
  heroBtnSecondary: "Get Quote",
  heroBgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&fit=crop",
  stats: [
    { num: "26+", label: "Countries" },
    { num: "500+", label: "Products" },
    { num: "13+", label: "India Offices" },
    { num: "25+", label: "Years Experience" },
  ],
  certifications: ["ISO 14001:2015", "ISO 45001:2018", "ISO 9001:2015", "26 Countries", "Reebok Partner"],
  phone: "+91 86579 64733",
  whatsapp: "+91 86579 64733",
  emailSales: "sales@jeraifitness.com",
  emailSupport: "care@jeraifitness.com",
  gst: "27AMLPY4881C1ZI",
  primaryColor: "#4a8fa8",
  categories: ["Treadmills", "Ellipticals", "Upright Bikes", "Recumbent Bikes", "Strength", "Home Range", "Accessories"],
};
