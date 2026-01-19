import { SiteSettings } from "../models/SiteSettings.js";

export const getSettings = async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings();
    await settings.save();
  }
  // Populate categories to show details if needed
  await settings.populate("home_categories");

  res.status(200).json({ data: settings });
};

export const updateSettings = async (req, res) => {
  const {
    website_title,
    home_categories,
    banner_slides,
    benefits,
    cta,
    cta2,
    testimonials,
    theme,
    about_page,
    contact_page,
    policies,
    seo,
    logo_url,
    home_categories_active,
    announcement,
    banner_active,
    benefits_active,
    testimonials_active,
    footer_settings,
    social_links,
    auth_settings,
    shipping_config,
    vat_config,
    payment_methods,
  } = req.body;

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings();
  }

  // Helper to parse if string
  const parse = (val) => (typeof val === "string" ? JSON.parse(val) : val);

  // 1. Process Files and Upload
  const uploadedFiles = {}; // map fieldname -> url
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      uploadedFiles[file.fieldname] = file.path; // or file.secure_url
    }
  }

  // 2. Parse Body Data
  if (website_title) settings.website_title = parse(website_title);
  if (home_categories) settings.home_categories = parse(home_categories);
  if (home_categories_active !== undefined)
    settings.home_categories_active = parse(home_categories_active);
  if (announcement) settings.announcement = parse(announcement);
  if (shipping_config) settings.shipping_config = parse(shipping_config);
  if (vat_config) settings.vat_config = parse(vat_config);
  if (payment_methods) settings.payment_methods = parse(payment_methods);

  // 3. Process Complex Fields (mix of JSON strings + potential file overwrites)
  if (banner_slides) {
    let slides = parse(banner_slides);
    // Map uploaded files to slides
    slides = slides.map((slide, index) => {
      const fileKey = `banner_slides[${index}].image`;
      if (uploadedFiles[fileKey]) {
        slide.image = uploadedFiles[fileKey];
      }
      return slide;
    });
    settings.banner_slides = slides;
  }
  if (banner_active !== undefined)
    settings.banner_active = parse(banner_active);

  if (benefits) settings.benefits = parse(benefits);
  if (benefits_active !== undefined)
    settings.benefits_active = parse(benefits_active);

  if (cta) {
    let ctaData = parse(cta);
    if (uploadedFiles["cta.logo_image"]) {
      ctaData.logo_image = uploadedFiles["cta.logo_image"];
    }
    settings.cta = ctaData;
  }

  if (cta2) {
    let cta2Data = parse(cta2);
    // Handle images array
    if (cta2Data.images && Array.isArray(cta2Data.images)) {
      cta2Data.images = cta2Data.images.map((img, index) => {
        const fileKey = `cta2.images[${index}]`;
        if (uploadedFiles[fileKey]) {
          return uploadedFiles[fileKey];
        }
        return img;
      });
    }
    settings.cta2 = cta2Data;
  }

  if (testimonials) settings.testimonials = parse(testimonials);
  if (testimonials_active !== undefined)
    settings.testimonials_active = parse(testimonials_active);

  if (theme) settings.theme = parse(theme);
  if (about_page) settings.about_page = parse(about_page);
  if (contact_page) settings.contact_page = parse(contact_page);
  if (footer_settings) settings.footer_settings = parse(footer_settings);
  if (social_links) settings.social_links = parse(social_links);
  if (policies) settings.policies = parse(policies);
  if (seo) {
    let seoData = parse(seo);
    if (uploadedFiles["seo.og_image"]) {
      seoData.og_image = uploadedFiles["seo.og_image"];
    }
    settings.seo = seoData;
  }

  if (auth_settings) {
    let authData = parse(auth_settings);
    if (uploadedFiles["auth_video_file"]) {
      authData.auth_video_url = uploadedFiles["auth_video_file"];
    }
    settings.auth_settings = authData;
  }

  // Logo (special cases)
  if (uploadedFiles["logo_url_file"]) {
    settings.logo_url = uploadedFiles["logo_url_file"];
  } else if (logo_url !== undefined) {
    settings.logo_url = logo_url;
  }

  await settings.save();
  // Re-populate to ensure frontend gets full objects
  await settings.populate("home_categories");

  res.status(200).json({
    message: "Settings updated successfully",
    data: settings,
  });
};
