import Joi from "joi";
import mongoose from "mongoose";

const multilingualStringSchema = Joi.object({
  en: Joi.string().allow("").optional(),
  fr: Joi.string().allow("").optional(),
  ar: Joi.string().allow("").optional(),
});

const SiteSettingsJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  logo_url: Joi.string().allow("").optional(),
  website_title: Joi.object({
    en: Joi.string().allow("").optional(),
    fr: Joi.string().allow("").optional(),
    ar: Joi.string().allow("").optional(),
  }).optional(),
  home_categories: Joi.array().items(Joi.any().optional()),
  home_categories_active: Joi.boolean().default(true).optional(),
  announcement: Joi.object({
    text: multilingualStringSchema.optional(),
    isActive: Joi.boolean().default(true).optional(),
  }).optional(),
  banner_slides: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().strip(),
        image: Joi.string().allow("").optional(),
        title: multilingualStringSchema.optional(),
        subtitle: multilingualStringSchema.optional(),
        description: multilingualStringSchema.optional(),
        buttonText: multilingualStringSchema.optional(),
        link: Joi.string().allow("").optional(),
      }),
    )
    .optional(),
  banner_active: Joi.boolean().default(true).optional(),
  benefits: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().strip(),
        icon: Joi.string().allow("").optional(),
        title: multilingualStringSchema.optional(),
        description: multilingualStringSchema.optional(),
      }),
    )
    .optional(),
  benefits_active: Joi.boolean().default(true).optional(),
  cta: Joi.object({
    logo_image: Joi.string().allow("").optional(),
    title_part1: multilingualStringSchema.optional(),
    title_part2: multilingualStringSchema.optional(),
    description: multilingualStringSchema.optional(),
    primary_button_text: multilingualStringSchema.optional(),
    secondary_button_text: multilingualStringSchema.optional(),
    primary_button_link: Joi.string().allow("").optional(),
    secondary_button_link: Joi.string().allow("").optional(),
    isActive: Joi.boolean().default(true).optional(),
  }).optional(),
  cta2: Joi.object({
    heading: multilingualStringSchema.optional(),
    paragraph: multilingualStringSchema.optional(),
    link_text: multilingualStringSchema.optional(),
    link_url: Joi.string().allow("").optional(),
    images: Joi.array().items(Joi.string().allow("")).optional(),
    isActive: Joi.boolean().default(true).optional(),
  }).optional(),
  testimonials: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().strip(),
        quote: multilingualStringSchema.optional(),
        attribution: multilingualStringSchema.optional(),
      }),
    )
    .optional(),
  testimonials_active: Joi.boolean().default(true).optional(),
  theme: Joi.object({
    primary_color: Joi.string().allow("").optional(),
    secondary_color: Joi.string().allow("").optional(),
    accent_color: Joi.string().allow("").optional(),
    bgColor: Joi.string().allow("").optional(),
  }).optional(),
  about_page: Joi.object({
    title: multilingualStringSchema.optional(),
    subtitle: multilingualStringSchema.optional(),
    description: multilingualStringSchema.optional(),
    items: Joi.array()
      .items(
        Joi.object({
          _id: Joi.any().strip(),
          icon: Joi.string().allow("").optional(),
          title: multilingualStringSchema.optional(),
          description: multilingualStringSchema.optional(),
        }),
      )
      .optional(),
  }).optional(),
  contact_page: Joi.object({
    address: multilingualStringSchema.optional(),
    address_city: multilingualStringSchema.optional(),
    phone: Joi.string().allow("").optional(),
    email: Joi.string().allow("").optional(),
    google_maps_link: Joi.string().allow("").optional(),
    working_hours: Joi.object({
      mon_fri: Joi.string().allow("").optional(),
      sat_sun: Joi.string().allow("").optional(),
    }).optional(),
  }).optional(),
  footer_settings: Joi.object({
    description: multilingualStringSchema.optional(),
    copyright: multilingualStringSchema.optional(),
    isActive: Joi.boolean().default(true).optional(),
  }).optional(),
  social_links: Joi.object({
    facebook: Joi.string().allow("").optional(),
    instagram: Joi.string().allow("").optional(),
    twitter: Joi.string().allow("").optional(),
  }).optional(),
  policies: Joi.object({
    terms: Joi.object({
      text: multilingualStringSchema.optional(),
      isActive: Joi.boolean().default(true).optional(),
    }).optional(),
    returns: Joi.object({
      text: multilingualStringSchema.optional(),
      isActive: Joi.boolean().default(true).optional(),
    }).optional(),
    shipping: Joi.object({
      text: multilingualStringSchema.optional(),
      isActive: Joi.boolean().default(true).optional(),
    }).optional(),
    refund: Joi.object({
      text: multilingualStringSchema.optional(),
      isActive: Joi.boolean().default(true).optional(),
    }).optional(),
    isActive: Joi.boolean().default(true).optional(),
  }).optional(),
  seo: Joi.object({
    meta_title: multilingualStringSchema.optional(),
    meta_description: multilingualStringSchema.optional(),
    meta_keywords: multilingualStringSchema.optional(),
    og_image: Joi.string().allow("").optional(),
  }).optional(),
  auth_settings: Joi.object({
    auth_video_url: Joi.string().allow("").optional(),
  }).optional(),
  shipping_config: Joi.object({
    standard_shipping_enabled: Joi.boolean().default(true).optional(),
    express_shipping_enabled: Joi.boolean().default(true).optional(),
    overnight_shipping_enabled: Joi.boolean().default(true).optional(),
    free_shipping_enabled: Joi.boolean().default(false).optional(),
    free_shipping_threshold: Joi.number().min(0).default(0).optional(),
    default_shipping_cost: Joi.number().min(0).default(30).optional(),
    express_shipping_cost: Joi.number().min(0).default(45).optional(),
    overnight_shipping_cost: Joi.number().min(0).default(65).optional(),
  }).optional(),
  vat_config: Joi.object({
    isActive: Joi.boolean().default(true).optional(),
    percentage: Joi.number().min(0).max(100).default(20).optional(),
  }).optional(),
  payment_methods: Joi.object({
    paypal_active: Joi.boolean().default(true).optional(),
    stripe_active: Joi.boolean().default(true).optional(),
  }).optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

const multilingualSchema = {
  en: { type: String, required: false, default: "" },
  fr: { type: String, required: false, default: "" },
  ar: { type: String, required: false, default: "" },
};

const SiteSettingsSchema = new mongoose.Schema(
  {
    logo_url: { type: String, required: false, default: "" },
    website_title: {
      en: { type: String, required: false, default: "" },
      fr: { type: String, required: false, default: "" },
      ar: { type: String, required: false, default: "" },
    },
    home_categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
    home_categories_active: { type: Boolean, default: true },
    announcement: {
      text: multilingualSchema,
      isActive: { type: Boolean, default: true },
    },
    banner_slides: [
      {
        image: { type: String, required: false, default: "" },
        title: multilingualSchema,
        subtitle: multilingualSchema,
        description: multilingualSchema,
        buttonText: multilingualSchema,
        link: { type: String, required: false, default: "" },
      },
    ],
    banner_active: { type: Boolean, default: true },
    benefits: [
      {
        icon: { type: String, required: false, default: "" },
        title: multilingualSchema,
        description: multilingualSchema,
      },
    ],
    benefits_active: { type: Boolean, default: true },
    cta: {
      logo_image: { type: String, required: false, default: "" },
      title_part1: multilingualSchema,
      title_part2: multilingualSchema,
      description: multilingualSchema,
      primary_button_text: multilingualSchema,
      secondary_button_text: multilingualSchema,
      primary_button_link: { type: String, required: false, default: "" },
      secondary_button_link: { type: String, required: false, default: "" },
      isActive: { type: Boolean, default: true },
    },
    cta2: {
      heading: multilingualSchema,
      paragraph: multilingualSchema,
      link_text: multilingualSchema,
      link_url: { type: String, required: false, default: "" },
      images: [{ type: String, required: false, default: "" }],
      isActive: { type: Boolean, default: true },
    },
    testimonials: [
      {
        quote: multilingualSchema,
        attribution: multilingualSchema,
      },
    ],
    testimonials_active: { type: Boolean, default: true },
    theme: {
      primary_color: { type: String, default: "#15803d" },
      secondary_color: { type: String, default: "#eab308" },
      accent_color: { type: String, default: "#fefce8" },
      bgColor: { type: String, default: "#ffffff" },
    },
    about_page: {
      title: multilingualSchema,
      subtitle: multilingualSchema,
      description: multilingualSchema,
      items: [
        {
          icon: { type: String, default: "" },
          title: multilingualSchema,
          description: multilingualSchema,
        },
      ],
    },
    contact_page: {
      address: multilingualSchema,
      address_city: multilingualSchema,
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      google_maps_link: { type: String, default: "" },
      working_hours: {
        mon_fri: { type: String, default: "" },
        sat_sun: { type: String, default: "" },
      },
    },
    footer_settings: {
      description: multilingualSchema,
      copyright: multilingualSchema,
      isActive: { type: Boolean, default: true },
    },
    social_links: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    policies: {
      terms: {
        text: multilingualSchema,
        isActive: { type: Boolean, default: true },
      },
      returns: {
        text: multilingualSchema,
        isActive: { type: Boolean, default: true },
      },
      shipping: {
        text: multilingualSchema,
        isActive: { type: Boolean, default: true },
      },
      refund: {
        text: multilingualSchema,
        isActive: { type: Boolean, default: true },
      },
      isActive: { type: Boolean, default: true },
    },
    seo: {
      meta_title: multilingualSchema,
      meta_description: multilingualSchema,
      meta_keywords: multilingualSchema,
      og_image: { type: String, default: "" },
    },
    auth_settings: {
      auth_video_url: { type: String, default: "" },
    },
    shipping_config: {
      standard_shipping_enabled: { type: Boolean, default: true },
      express_shipping_enabled: { type: Boolean, default: true },
      overnight_shipping_enabled: { type: Boolean, default: true },
      free_shipping_enabled: { type: Boolean, default: false },
      free_shipping_threshold: { type: Number, default: 0 },
      default_shipping_cost: { type: Number, default: 30 },
      express_shipping_cost: { type: Number, default: 45 },
      overnight_shipping_cost: { type: Number, default: 65 },
    },
    vat_config: {
      isActive: { type: Boolean, default: true },
      percentage: { type: Number, default: 20 },
    },
    payment_methods: {
      paypal_active: { type: Boolean, default: true },
      stripe_active: { type: Boolean, default: true },
    },
  },
  {
    collection: "SiteSettings",
    versionKey: false,
    timestamps: true,
  },
);

SiteSettingsSchema.pre("save", async function () {
  try {
    const validatedData = await SiteSettingsJoiSchema.validateAsync(
      this.toObject(),
    );

    this.logo_url = validatedData.logo_url;
    this.website_title = validatedData.website_title;
    this.home_categories = validatedData.home_categories;
    this.home_categories_active = validatedData.home_categories_active;
    this.announcement = validatedData.announcement;
    this.banner_slides = validatedData.banner_slides;
    this.banner_active = validatedData.banner_active;
    this.benefits = validatedData.benefits;
    this.benefits_active = validatedData.benefits_active;
    this.cta = validatedData.cta;
    this.cta2 = validatedData.cta2;
    this.testimonials = validatedData.testimonials;
    this.testimonials_active = validatedData.testimonials_active;
    this.theme = validatedData.theme;
    this.about_page = validatedData.about_page;
    this.contact_page = validatedData.contact_page;
    this.footer_settings = validatedData.footer_settings;
    this.social_links = validatedData.social_links;
    this.policies = validatedData.policies;
    this.seo = validatedData.seo;
    this.auth_settings = validatedData.auth_settings;
    this.shipping_config = validatedData.shipping_config;
    this.vat_config = validatedData.vat_config;
    this.payment_methods = validatedData.payment_methods;
  } catch (error) {
    console.error(error);
  }
});

export const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
