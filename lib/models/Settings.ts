import mongoose, { Schema, Document, Model } from "mongoose";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/settings-defaults";

export type { SiteSettings };
export { DEFAULT_SETTINGS };

export interface ISettings extends Document, SiteSettings {
  _key: string;
}

const StatSchema = new Schema<{ num: string; label: string }>(
  { num: String, label: String },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    _key: { type: String, default: "global", unique: true },
    storeName: { type: String, default: DEFAULT_SETTINGS.storeName },
    storeNameGold: { type: String, default: DEFAULT_SETTINGS.storeNameGold },
    storeTagline: { type: String, default: DEFAULT_SETTINGS.storeTagline },
    storeDescription: { type: String, default: DEFAULT_SETTINGS.storeDescription },
    announcementEnabled: { type: Boolean, default: true },
    announcementText: { type: String, default: DEFAULT_SETTINGS.announcementText },
    heroTitle: { type: String, default: DEFAULT_SETTINGS.heroTitle },
    heroTitleGold: { type: String, default: DEFAULT_SETTINGS.heroTitleGold },
    heroSubtitle: { type: String, default: DEFAULT_SETTINGS.heroSubtitle },
    heroBtnPrimary: { type: String, default: DEFAULT_SETTINGS.heroBtnPrimary },
    heroBtnSecondary: { type: String, default: DEFAULT_SETTINGS.heroBtnSecondary },
    heroBgImage: { type: String, default: DEFAULT_SETTINGS.heroBgImage },
    stats: { type: [StatSchema], default: DEFAULT_SETTINGS.stats },
    certifications: { type: [String], default: DEFAULT_SETTINGS.certifications },
    primaryColor: { type: String, default: DEFAULT_SETTINGS.primaryColor },
    categories: { type: [String], default: DEFAULT_SETTINGS.categories },
    phone: { type: String, default: DEFAULT_SETTINGS.phone },
    whatsapp: { type: String, default: DEFAULT_SETTINGS.whatsapp },
    emailSales: { type: String, default: DEFAULT_SETTINGS.emailSales },
    emailSupport: { type: String, default: DEFAULT_SETTINGS.emailSupport },
    gst: { type: String, default: DEFAULT_SETTINGS.gst },
  },
  { timestamps: true }
);

const SettingsModel: Model<ISettings> =
  mongoose.models.Settings ?? mongoose.model<ISettings>("Settings", SettingsSchema);

export default SettingsModel;
