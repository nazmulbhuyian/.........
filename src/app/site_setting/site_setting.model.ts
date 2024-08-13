import { Schema, model } from "mongoose";
import { ISiteSettingInterface } from "./site_setting.interface";

// site setting Schema
const site_settingSchema = new Schema<ISiteSettingInterface>(
  {
    logo: {
      type: String,
    },
    footer_logo: {
      type: String,
    },
    favicon: {
      type: String,
    },
    title: {
      type: String,
    },
    emergency_contact: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    start_close: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    you_tube: {
      type: String,
    },
    watsapp: {
      type: String,
    },
    location: {
      type: String,
    },
    delivery_time_inside_dhaka: {
      type: String,
    },
    delivery_time_outside_dhaka: {
      type: String,
    },
    delivery_condition: {
      type: String,
    },
    about_us: {
      type: String,
    },
    return_policy: {
      type: String,
    },
    refund_policy: {
      type: String,
    },
    cancellation_policy: {
      type: String,
    },
    privacy_policy: {
      type: String,
    },
    terms_condition: {
      type: String,
    },
    ssl_store_id: {
      type: String,
    },
    ssl_store_password: {
      type: String,
    },
    ssl_active: {
      type: Boolean,
      default: false,
    },
    ssl_is_live: {
      type: Boolean,
      default: false,
    },
    stripe_primary_key: {
      type: String,
    },
    stripe_secret_key: {
      type: String,
    },
    stripe_active: {
      type: Boolean,
      default: false,
    },
    currency_symbol: {
      type: String,
    },
    currency_code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettingModel = model<ISiteSettingInterface>(
  "settings",
  site_settingSchema
);

export default SiteSettingModel;
