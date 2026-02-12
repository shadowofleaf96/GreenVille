import { toast } from "react-toastify";

/**
 * Export settings to JSON file
 * Note: Excludes 'translations' field as that should be managed separately via translation management
 */
export const exportSettings = (settings, filename = "settings-backup.json") => {
  try {
    // Exclude translations from export to avoid confusion
    const { translations, ...settingsToExport } = settings;

    const dataStr = JSON.stringify(settingsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Failed to export settings");
    return false;
  }
};

/**
 * Validate imported settings structure
 */
export const validateSettings = (data) => {
  const requiredFields = ["website_title", "logo_url", "theme"];

  for (const field of requiredFields) {
    if (!(field in data)) {
      return {
        valid: false,
        error: `Missing required field: ${field}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Import settings from JSON
 */
export const importSettings = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const validation = validateSettings(data);

        if (!validation.valid) {
          reject(new Error(validation.error));
          return;
        }

        resolve(data);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

/**
 * Get default settings
 */
export const getDefaultSettings = () => {
  return {
    website_title: { en: "", fr: "", ar: "" },
    logo_url: "",
    home_categories: [],
    home_categories_active: true,
    announcement: {
      text: { en: "", fr: "", ar: "" },
      isActive: true,
    },
    banner_slides: [],
    banner_active: true,
    benefits: [],
    benefits_active: true,
    cta: {
      logo_image: "",
      title_part1: { en: "", fr: "", ar: "" },
      title_part2: { en: "", fr: "", ar: "" },
      description: { en: "", fr: "", ar: "" },
      primary_button_text: { en: "", fr: "", ar: "" },
      secondary_button_text: { en: "", fr: "", ar: "" },
      primary_button_link: "",
      secondary_button_link: "",
      isActive: true,
    },
    cta2: {
      heading: { en: "", fr: "", ar: "" },
      paragraph: { en: "", fr: "", ar: "" },
      link_text: { en: "", fr: "", ar: "" },
      link_url: "",
      images: ["", ""],
      isActive: true,
    },
    testimonials: [],
    testimonials_active: true,
    theme: {
      primary_color: "#15803d",
      secondary_color: "#eab308",
      accent_color: "#fefce8",
      bgColor: "#ffffff",
    },
    about_page: {
      title: { en: "", fr: "", ar: "" },
      subtitle: { en: "", fr: "", ar: "" },
      description: { en: "", fr: "", ar: "" },
      items: [],
    },
    contact_page: {
      address: { en: "", fr: "", ar: "" },
      address_city: { en: "", fr: "", ar: "" },
      phone: "",
      email: "",
      google_maps_link: "",
      working_hours: {
        mon_fri: "08:00 - 19:00",
        sat_sun: "08:00 - 12:00",
      },
    },
    policies: {
      terms: { text: { en: "", fr: "", ar: "" }, isActive: true },
      returns: { text: { en: "", fr: "", ar: "" }, isActive: true },
      shipping: { text: { en: "", fr: "", ar: "" }, isActive: true },
      refund: { text: { en: "", fr: "", ar: "" }, isActive: true },
      isActive: true,
    },
    footer_settings: {
      description: { en: "", fr: "", ar: "" },
      copyright: { en: "", fr: "", ar: "" },
      isActive: true,
    },
    social_links: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    seo: {
      meta_title: { en: "", fr: "", ar: "" },
      meta_description: { en: "", fr: "", ar: "" },
      meta_keywords: { en: "", fr: "", ar: "" },
      og_image: "",
    },
    auth_settings: {
      auth_video_url: "",
    },
    shipping_config: {
      standard_shipping_enabled: true,
      express_shipping_enabled: true,
      overnight_shipping_enabled: true,
      free_shipping_enabled: false,
      free_shipping_threshold: 0,
      default_shipping_cost: 30,
      express_shipping_cost: 45,
      overnight_shipping_cost: 65,
    },
    vat_config: {
      isActive: true,
      percentage: 20,
    },
    payment_methods: {
      paypal_active: true,
      stripe_active: true,
    },
    translations: {},
  };
};
