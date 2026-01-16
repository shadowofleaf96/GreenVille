import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify/iconify";
import ImageUpload from "../../../components/image-upload";
import IconPicker from "../../../components/icon-picker";
import {
  fetchSettings,
  updateSettings,
} from "../../../../redux/backoffice/settingsSlice";
import createAxiosInstance from "../../../../utils/axiosConfig";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Reusable Multilingual Input Component
const MultiLingualInput = ({
  control,
  baseName,
  label,
  multiline = false,
  disabled = false,
}) => {
  const { t } = useTranslation(); // eslint-disable-line no-unused-vars
  return (
    <div
      className={`space-y-2 ${
        disabled ? "opacity-50 pointer-events-none" : "opacity-100"
      } transition-opacity duration-300`}
    >
      <Label className="text-sm font-bold text-gray-800">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name={`${baseName}.en`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-primary/40 tracking-[0.2em] px-1">
                English
              </span>
              {multiline ? (
                <Textarea
                  {...field}
                  className="rounded-xl border-gray-200 focus-visible:ring-primary/20 min-h-20 resize-none"
                />
              ) : (
                <Input
                  {...field}
                  className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-9"
                />
              )}
            </div>
          )}
        />
        <Controller
          name={`${baseName}.fr`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-primary/40 tracking-[0.2em] px-1">
                Français
              </span>
              {multiline ? (
                <Textarea
                  {...field}
                  className="rounded-xl border-gray-200 focus-visible:ring-primary/20 min-h-20 resize-none"
                />
              ) : (
                <Input
                  {...field}
                  className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-9"
                />
              )}
            </div>
          )}
        />
        <Controller
          name={`${baseName}.ar`}
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black text-primary/40 tracking-[0.2em] px-1">
                العربية
              </span>
              {multiline ? (
                <Textarea
                  {...field}
                  dir="rtl"
                  className="rounded-xl border-gray-200 focus-visible:ring-primary/20 min-h-20 resize-none"
                />
              ) : (
                <Input
                  {...field}
                  dir="rtl"
                  className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-9"
                />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

const SectionHeader = ({
  title,
  isActive,
  onToggle,
  isCollapsible = true,
  isOpen,
  onToggleCollapse,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Card className="border-none shadow-sm overflow-hidden mb-6 bg-white">
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors ${
          isOpen ? "border-b border-gray-100" : ""
        }`}
        onClick={onToggleCollapse}
      >
        <h6 className="text-xl font-bold text-gray-800 tracking-tight">
          {title}
        </h6>

        <div className="flex items-center space-x-6">
          {onToggle && (
            <div
              className="flex items-center space-x-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch checked={isActive} onCheckedChange={onToggle} />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {isActive ? t("Enabled") : t("Disabled")}
              </span>
            </div>
          )}
          {isCollapsible && (
            <Iconify
              icon="ic:baseline-expand-more"
              className={`w-6 h-6 transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>
      {isOpen && (
        <CardContent className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default function SettingsView() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { data: settingsData, loading } = useSelector(
    (state) => state.adminSettings
  );
  const [categories, setCategories] = useState([]);
  const [expandedSection, setExpandedSection] = useState("");

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\D/g, "");
    if (sanitized.startsWith("00212")) {
      sanitized = "0" + sanitized.slice(5);
    } else if (sanitized.startsWith("212")) {
      sanitized = "0" + sanitized.slice(3);
    }
    if (sanitized && !sanitized.startsWith("0")) {
      sanitized = "0" + sanitized;
    }
    return sanitized;
  };

  const { handleSubmit, control, setValue, reset, watch } = useForm({
    defaultValues: {
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
    },
  });

  const {
    fields: bannerFields,
    append: appendBanner,
    remove: removeBanner,
  } = useFieldArray({ control, name: "banner_slides" });
  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({ control, name: "benefits" });
  const {
    fields: testimonialFields,
    append: appendTestimonial,
    remove: removeTestimonial,
  } = useFieldArray({ control, name: "testimonials" });
  const {
    fields: aboutItemsFields,
    append: appendAboutItem,
    remove: removeAboutItem,
  } = useFieldArray({ control, name: "about_page.items" });

  useEffect(() => {
    dispatch(fetchSettings());
    const fetchCategories = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (settingsData) {
      const formData = {
        ...settingsData,
        home_categories:
          settingsData.home_categories?.map((cat) =>
            typeof cat === "object" ? cat._id : cat
          ) || [],
        cta2: {
          ...settingsData.cta2,
          images: settingsData.cta2?.images?.length
            ? settingsData.cta2.images
            : ["", ""],
        },
        shipping_config: settingsData.shipping_config || {
          standard_shipping_enabled: true,
          express_shipping_enabled: true,
          overnight_shipping_enabled: true,
          free_shipping_enabled: false,
          free_shipping_threshold: 0,
          default_shipping_cost: 30,
          express_shipping_cost: 45,
          overnight_shipping_cost: 65,
        },
        vat_config: settingsData.vat_config || {
          isActive: true,
          percentage: 20,
        },
        payment_methods: settingsData.payment_methods || {
          paypal_active: true,
          stripe_active: true,
        },
        translations: settingsData.translations || {},
      };
      reset(formData);
    }
  }, [settingsData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.logo_url instanceof File)
      formData.append("logo_url_file", data.logo_url);
    else formData.append("logo_url", data.logo_url || "");

    formData.append("website_title", JSON.stringify(data.website_title));
    formData.append("home_categories", JSON.stringify(data.home_categories));
    formData.append("home_categories_active", data.home_categories_active);
    formData.append("announcement", JSON.stringify(data.announcement));

    const slidesPayload = data.banner_slides.map((slide, index) => {
      const slideClone = { ...slide };
      if (slide.image instanceof File) {
        formData.append(`banner_slides[${index}].image`, slide.image);
        slideClone.image = "";
      }
      return slideClone;
    });
    formData.append("banner_slides", JSON.stringify(slidesPayload));
    formData.append("banner_active", data.banner_active);
    formData.append("benefits", JSON.stringify(data.benefits));
    formData.append("benefits_active", data.benefits_active);

    const ctaPayload = { ...data.cta };
    if (ctaPayload.logo_image instanceof File) {
      formData.append("cta.logo_image", ctaPayload.logo_image);
      ctaPayload.logo_image = "";
    }
    formData.append("cta", JSON.stringify(ctaPayload));

    const cta2Payload = { ...data.cta2, images: [...(data.cta2.images || [])] };
    if (cta2Payload.images && Array.isArray(cta2Payload.images)) {
      cta2Payload.images = cta2Payload.images.map((img, index) => {
        if (img instanceof File) {
          formData.append(`cta2.images[${index}]`, img);
          return "";
        }
        return img;
      });
    }
    formData.append("cta2", JSON.stringify(cta2Payload));

    formData.append("testimonials", JSON.stringify(data.testimonials));
    formData.append("testimonials_active", data.testimonials_active);
    formData.append("theme", JSON.stringify(data.theme));
    formData.append("about_page", JSON.stringify(data.about_page));
    const contactPageToSave = {
      ...data.contact_page,
      phone: formatPhone(data.contact_page.phone),
    };
    formData.append("contact_page", JSON.stringify(contactPageToSave));
    formData.append("policies", JSON.stringify(data.policies));
    formData.append("footer_settings", JSON.stringify(data.footer_settings));
    formData.append("social_links", JSON.stringify(data.social_links));

    const seoPayload = { ...data.seo };
    if (data.seo?.og_image instanceof File) {
      formData.append("seo.og_image", data.seo.og_image);
      seoPayload.og_image = "";
    }
    formData.append("seo", JSON.stringify(seoPayload));
    formData.append(
      "auth_settings",
      JSON.stringify(data.auth_settings || { auth_video_url: "" })
    );

    if (data.auth_settings?.auth_video_url instanceof File) {
      formData.append("auth_video_file", data.auth_settings.auth_video_url);
    }
    formData.append(
      "shipping_config",
      JSON.stringify(data.shipping_config || {})
    );
    formData.append("vat_config", JSON.stringify(data.vat_config || {}));
    formData.append(
      "payment_methods",
      JSON.stringify(data.payment_methods || {})
    );
    formData.append("translations", JSON.stringify(data.translations || {}));

    dispatch(updateSettings(formData));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 space-y-4 sm:space-y-0">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Site Settings")}
        </h4>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="px-8 py-6 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center space-x-2 text-lg"
        >
          {loading ? (
            <Iconify
              icon="svg-spinners:180-ring-with-bg"
              className="w-6 h-6 mr-2"
            />
          ) : (
            <Iconify icon="material-symbols:save" className="w-6 h-6 mr-2" />
          )}
          <span>{t("Save Changes")}</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Announcement Section */}
        <SectionHeader
          title={t("Announcement Bar")}
          isActive={watch("announcement.isActive")}
          onToggle={(val) => setValue("announcement.isActive", val)}
          isOpen={expandedSection === "announcement"}
          onToggleCollapse={() => toggleSection("announcement")}
        >
          <MultiLingualInput
            control={control}
            baseName="announcement.text"
            label={t("Announcement Text")}
            disabled={!watch("announcement.isActive")}
          />
        </SectionHeader>

        {/* Auth Page Settings Section */}
        <SectionHeader
          title={t("Auth Pages Settings")}
          isOpen={expandedSection === "auth_settings"}
          onToggleCollapse={() => toggleSection("auth_settings")}
        >
          <div className="grid grid-cols-1 gap-6">
            <Controller
              name="auth_settings.auth_video_url"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                    {t("Authentication Video URL")}
                  </Label>

                  {/* Current Video Preview or URL Text */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase">
                        Upload File
                      </Label>
                      <Input
                        type="file"
                        accept="video/mp4,video/webm,image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-10 pt-1.5"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase">
                        Or Direct URL
                      </Label>
                      <Input
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="https://..."
                        className="h-10 rounded-md bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  {field.value && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 mt-2">
                      {(() => {
                        const val = field.value;
                        const isFile = val instanceof File;
                        // Naive check: if it has image extension or is image file type, render img. Else video.
                        const isImage = isFile
                          ? val.type.startsWith("image/")
                          : typeof val === "string" &&
                            val.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)$/i);

                        if (isImage) {
                          return (
                            <img
                              src={isFile ? URL.createObjectURL(val) : val}
                              alt="Auth Background"
                              className="w-full h-full object-cover"
                            />
                          );
                        } else {
                          return (
                            <video
                              src={isFile ? URL.createObjectURL(val) : val}
                              controls
                              className="w-full h-full object-cover"
                            />
                          );
                        }
                      })()}
                    </div>
                  )}

                  {field.value instanceof File && (
                    <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                      <Iconify icon="eva:checkmark-circle-2-fill" width={20} />
                      File selected: {field.value.name}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 font-medium ml-1">
                    {t(
                      "Upload a video or enter a URL for all authentication pages."
                    )}
                  </p>
                </div>
              )}
            />
          </div>
        </SectionHeader>

        {/* Shipping Configuration Section */}
        <SectionHeader
          title={t("Shipping Configuration")}
          isOpen={expandedSection === "shipping_config"}
          onToggleCollapse={() => toggleSection("shipping_config")}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="space-y-1">
                <Label className="text-base font-bold text-gray-800 tracking-tight">
                  {t("Free Shipping Feature")}
                </Label>
                <p className="text-xs text-gray-500 font-medium">
                  {t("Enable or disable free shipping based on order total.")}
                </p>
              </div>
              <Controller
                name="shipping_config.free_shipping_enabled"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {field.value ? t("Enabled") : t("Disabled")}
                    </span>
                  </div>
                )}
              />
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
                !watch("shipping_config.free_shipping_enabled")
                  ? "opacity-50 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <Controller
                name="shipping_config.free_shipping_threshold"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                      {t("Free Shipping Threshold (Amount)")}
                    </Label>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-10"
                    />
                    <p className="text-xs text-gray-500 font-medium">
                      {t(
                        "Cart total must be above this amount for free shipping."
                      )}
                    </p>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-100">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                    {t("Standard Shipping")}
                  </Label>
                </div>
                <Controller
                  name="shipping_config.standard_shipping_enabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Controller
                name="shipping_config.default_shipping_cost"
                control={control}
                render={({ field }) => (
                  <div
                    className={`space-y-4 transition-opacity duration-300 ${
                      !watch("shipping_config.standard_shipping_enabled")
                        ? "opacity-40 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    <Label className="text-sm font-bold text-gray-600 uppercase tracking-tight">
                      {t("Price (DH)")}
                    </Label>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-10"
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                    {t("Express Shipping")}
                  </Label>
                </div>
                <Controller
                  name="shipping_config.express_shipping_enabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Controller
                name="shipping_config.express_shipping_cost"
                control={control}
                render={({ field }) => (
                  <div
                    className={`space-y-4 transition-opacity duration-300 ${
                      !watch("shipping_config.express_shipping_enabled")
                        ? "opacity-40 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    <Label className="text-sm font-bold text-gray-600 uppercase tracking-tight">
                      {t("Price (DH)")}
                    </Label>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-10"
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                    {t("Overnight Shipping")}
                  </Label>
                </div>
                <Controller
                  name="shipping_config.overnight_shipping_enabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Controller
                name="shipping_config.overnight_shipping_cost"
                control={control}
                render={({ field }) => (
                  <div
                    className={`space-y-4 transition-opacity duration-300 ${
                      !watch("shipping_config.overnight_shipping_enabled")
                        ? "opacity-40 pointer-events-none"
                        : "opacity-100"
                    }`}
                  >
                    <Label className="text-sm font-bold text-gray-600 uppercase tracking-tight">
                      {t("Price (DH)")}
                    </Label>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-10"
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </SectionHeader>

        {/* Tax & Payment Configuration Section */}
        <SectionHeader
          title={t("Tax & Payment Configuration")}
          isOpen={expandedSection === "tax_payment_config"}
          onToggleCollapse={() => toggleSection("tax_payment_config")}
        >
          <div className="space-y-8">
            {/* VAT Config */}
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="space-y-1">
                  <Label className="text-base font-bold text-gray-800 tracking-tight">
                    {t("VAT (Value Added Tax)")}
                  </Label>
                  <p className="text-xs text-gray-500 font-medium">
                    {t("Enable or disable tax calculation on orders.")}
                  </p>
                </div>
                <Controller
                  name="vat_config.isActive"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        {field.value ? t("Enabled") : t("Disabled")}
                      </span>
                    </div>
                  )}
                />
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${
                  !watch("vat_config.isActive")
                    ? "opacity-50 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <Controller
                  name="vat_config.percentage"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                        {t("VAT Percentage (%)")}
                      </Label>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-10"
                      />
                      <p className="text-xs text-gray-500 font-medium">
                        {t("This percentage will be applied to the subtotal.")}
                      </p>
                    </div>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Payment Methods */}
            <div className="space-y-6">
              <Label className="text-xl font-bold text-gray-800 tracking-tight">
                {t("Payment Methods")}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <div className="flex items-center gap-3">
                    <Iconify
                      icon="logos:paypal"
                      width={24}
                      className={
                        watch("payment_methods.paypal_active")
                          ? ""
                          : "grayscale"
                      }
                    />
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-gray-800 tracking-tight">
                        {t("PayPal")}
                      </Label>
                    </div>
                  </div>
                  <Controller
                    name="payment_methods.paypal_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <div className="flex items-center gap-3">
                    <Iconify
                      icon="logos:stripe"
                      width={40}
                      className={
                        watch("payment_methods.stripe_active")
                          ? ""
                          : "grayscale"
                      }
                    />
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-gray-800 tracking-tight">
                        {t("Stripe (Credit Card)")}
                      </Label>
                    </div>
                  </div>
                  <Controller
                    name="payment_methods.stripe_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-100/50 rounded-2xl border border-dashed border-gray-300 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Iconify
                        icon="solar:wallet-money-bold-duotone"
                        width={24}
                        className="text-gray-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-base font-bold text-gray-400 tracking-tight">
                        {t("Cash on Delivery")}
                      </Label>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black uppercase text-gray-400"
                  >
                    {t("Always Enabled")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* Global Settings Section */}
        <SectionHeader
          title={t("General Information")}
          isOpen={expandedSection === "panel1"}
          onToggleCollapse={() => toggleSection("panel1")}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4 space-y-4">
              <Controller
                name="logo_url"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                      {t("Website Logo")}
                    </Label>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            <div className="md:col-span-8 space-y-6">
              <MultiLingualInput
                control={control}
                baseName="website_title"
                label={t("Website Title")}
              />

              <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-bold text-gray-800 tracking-tight">
                    {t("Home Categories")}
                  </Label>
                  <Controller
                    name="home_categories_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${
                    !watch("home_categories_active")
                      ? "opacity-50 pointer-events-none"
                      : "opacity-100"
                  }`}
                >
                  <Controller
                    name="home_categories"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {categories.map((cat) => {
                          const isSelected = field.value.includes(cat._id);
                          return (
                            <Badge
                              key={cat._id}
                              variant={isSelected ? "default" : "outline"}
                              className={`
                                cursor-pointer px-4 py-2 text-sm rounded-lg transition-all
                                ${
                                  isSelected
                                    ? "bg-primary hover:bg-primary shadow-md"
                                    : "hover:border-primary/50"
                                }
                              `}
                              onClick={() => {
                                const newValue = isSelected
                                  ? field.value.filter((id) => id !== cat._id)
                                  : [...field.value, cat._id];
                                field.onChange(newValue);
                              }}
                            >
                              {cat.category_name?.[i18n.language] ||
                                cat.category_name?.en}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* Banner Slides Section */}
        <SectionHeader
          title={t("Banner Slides")}
          isActive={watch("banner_active")}
          onToggle={(val) => setValue("banner_active", val)}
          isOpen={expandedSection === "banner"}
          onToggleCollapse={() => toggleSection("banner")}
        >
          <div
            className={`space-y-4 ${
              !watch("banner_active") ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {bannerFields.map((field, index) => (
              <Card
                key={field.id}
                className="p-4 border border-dashed border-gray-200 bg-gray-50/10 relative group hover:bg-gray-50/30 transition-colors"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBanner(index)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl"
                >
                  <Iconify
                    icon="material-symbols:delete-outline"
                    width={24}
                    height={24}
                  />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
                  <div className="md:col-span-3">
                    <Controller
                      name={`banner_slides[${index}].image`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-xs font-black uppercase tracking-widest text-gray-400">
                            {t("Slide Image")}
                          </Label>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </div>
                  <div className="md:col-span-9 space-y-6">
                    <MultiLingualInput
                      control={control}
                      baseName={`banner_slides[${index}].title`}
                      label={t("Title")}
                    />
                    <MultiLingualInput
                      control={control}
                      baseName={`banner_slides[${index}].subtitle`}
                      label={t("Subtitle")}
                    />
                    <MultiLingualInput
                      control={control}
                      baseName={`banner_slides[${index}].description`}
                      label={t("Description")}
                      multiline
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultiLingualInput
                        control={control}
                        baseName={`banner_slides[${index}].buttonText`}
                        label={t("Button Text")}
                      />
                      <div className="space-y-4">
                        <Label className="text-base font-bold text-gray-800">
                          {t("Button Link")}
                        </Label>
                        <Controller
                          name={`banner_slides[${index}].link`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendBanner({
                  image: "",
                  title: { en: "", fr: "", ar: "" },
                  subtitle: { en: "", fr: "", ar: "" },
                  description: { en: "", fr: "", ar: "" },
                  buttonText: { en: "", fr: "", ar: "" },
                  link: "",
                })
              }
              className="w-full h-12 border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-2xl flex items-center justify-center space-x-2 transition-all font-bold"
            >
              <Iconify icon="material-symbols:add" width={24} />
              <span>{t("Add New Slide")}</span>
            </Button>
          </div>
        </SectionHeader>

        {/* Benefits Section */}
        <SectionHeader
          title={t("Benefits Section")}
          isActive={watch("benefits_active")}
          onToggle={(val) => setValue("benefits_active", val)}
          isOpen={expandedSection === "benefits"}
          onToggleCollapse={() => toggleSection("benefits")}
        >
          <div
            className={`space-y-4 ${
              !watch("benefits_active") ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefitFields.map((field, index) => (
                <Card
                  key={field.id}
                  className="p-4 border border-dashed border-gray-200 bg-gray-50/10 relative group hover:bg-gray-50/30 transition-colors"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl"
                  >
                    <Iconify
                      icon="material-symbols:delete-outline"
                      width={24}
                      height={24}
                    />
                  </Button>
                  <div className="flex space-x-6">
                    <div className="w-20">
                      <Controller
                        name={`benefits[${index}].icon`}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                              {t("Icon")}
                            </Label>
                            <IconPicker
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="grow space-y-4">
                      <MultiLingualInput
                        control={control}
                        baseName={`benefits[${index}].title`}
                        label={t("Benefit Title")}
                      />
                      <MultiLingualInput
                        control={control}
                        baseName={`benefits[${index}].description`}
                        label={t("Benefit Description")}
                        multiline
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendBenefit({
                  icon: "material-symbols:star",
                  title: { en: "", fr: "", ar: "" },
                  description: { en: "", fr: "", ar: "" },
                })
              }
              className="w-full h-12 border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-2xl flex items-center justify-center space-x-2 transition-all font-bold"
            >
              <Iconify icon="material-symbols:add" width={24} />
              <span>{t("Add New Benefit")}</span>
            </Button>
          </div>
        </SectionHeader>

        {/* CTA Section */}
        <SectionHeader
          title={t("Call to Action (CTA)")}
          isActive={watch("cta.isActive")}
          onToggle={(val) => setValue("cta.isActive", val)}
          isOpen={expandedSection === "cta"}
          onToggleCollapse={() => toggleSection("cta")}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <Controller
                name="cta.logo_image"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                      {t("CTA Image")}
                    </Label>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            <div className="md:col-span-8 space-y-6">
              <MultiLingualInput
                control={control}
                baseName="cta.title_part1"
                label={t("Title Part 1")}
              />
              <MultiLingualInput
                control={control}
                baseName="cta.title_part2"
                label={t("Title Part 2")}
              />
              <MultiLingualInput
                control={control}
                baseName="cta.description"
                label={t("Description")}
                multiline
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-2xl border border-dashed border-gray-200">
                <div className="space-y-6">
                  <MultiLingualInput
                    control={control}
                    baseName="cta.primary_button_text"
                    label={t("Primary Button Text")}
                  />
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-800">
                      {t("Primary Button Link")}
                    </Label>
                    <Controller
                      name="cta.primary_button_link"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <MultiLingualInput
                    control={control}
                    baseName="cta.secondary_button_text"
                    label={t("Secondary Button Text")}
                  />
                  <div className="space-y-4">
                    <Label className="text-base font-bold text-gray-800">
                      {t("Secondary Button Link")}
                    </Label>
                    <Controller
                      name="cta.secondary_button_link"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* CTA2 Section */}
        <SectionHeader
          title={t("CTA 2 (Feature Promotion)")}
          isActive={watch("cta2.isActive")}
          onToggle={(val) => setValue("cta2.isActive", val)}
          isOpen={expandedSection === "cta2"}
          onToggleCollapse={() => toggleSection("cta2")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiLingualInput
                control={control}
                baseName="cta2.heading"
                label={t("Heading")}
              />
              <div className="space-y-6">
                <MultiLingualInput
                  control={control}
                  baseName="cta2.paragraph"
                  label={t("Paragraph")}
                  multiline
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiLingualInput
                    control={control}
                    baseName="cta2.link_text"
                    label={t("Link Text")}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-800">
                      {t("Link URL")}
                    </Label>
                    <Controller
                      name="cta2.link_url"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((idx) => (
                <Card
                  key={idx}
                  className="p-4 border border-dashed border-gray-200 bg-gray-50/10"
                >
                  <Controller
                    name={`cta2.images[${idx}]`}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-gray-400">
                          {t("Promotion Image")} {idx + 1}
                        </Label>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </Card>
              ))}
            </div>
          </div>
        </SectionHeader>

        {/* Testimonials Section */}
        <SectionHeader
          title={t("Testimonials")}
          isActive={watch("testimonials_active")}
          onToggle={(val) => setValue("testimonials_active", val)}
          isOpen={expandedSection === "testimonials"}
          onToggleCollapse={() => toggleSection("testimonials")}
        >
          <div
            className={`space-y-4 ${
              !watch("testimonials_active")
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialFields.map((field, index) => (
                <Card
                  key={field.id}
                  className="p-6 border border-dashed border-gray-200 bg-gray-50/10 relative group hover:bg-gray-50/30 transition-colors"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTestimonial(index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl"
                  >
                    <Iconify
                      icon="material-symbols:delete-outline"
                      width={24}
                      height={24}
                    />
                  </Button>
                  <div className="space-y-4">
                    <MultiLingualInput
                      control={control}
                      baseName={`testimonials[${index}].quote`}
                      label={t("Quote")}
                      multiline
                    />
                    <MultiLingualInput
                      control={control}
                      baseName={`testimonials[${index}].attribution`}
                      label={t("Attribution")}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendTestimonial({
                  quote: { en: "", fr: "", ar: "" },
                  attribution: { en: "", fr: "", ar: "" },
                })
              }
              className="w-full h-12 border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-2xl flex items-center justify-center space-x-2 transition-all font-bold"
            >
              <Iconify icon="material-symbols:add" width={24} />
              <span>{t("Add New Testimonial")}</span>
            </Button>
          </div>
        </SectionHeader>

        {/* About Page Section */}
        <SectionHeader
          title={t("About Page Content")}
          isOpen={expandedSection === "about"}
          onToggleCollapse={() => toggleSection("about")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiLingualInput
                control={control}
                baseName="about_page.title"
                label={t("Hero Title")}
              />
              <MultiLingualInput
                control={control}
                baseName="about_page.subtitle"
                label={t("Hero Subtitle")}
              />
            </div>
            <MultiLingualInput
              control={control}
              baseName="about_page.description"
              label={t("Main Description")}
              multiline
            />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-xl font-bold text-primary">
                  {t("About Key Points")}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendAboutItem({
                      title: { en: "", fr: "", ar: "" },
                      description: { en: "", fr: "", ar: "" },
                    })
                  }
                  className="rounded-xl border-primary text-primary hover:bg-primary/5"
                >
                  <Iconify icon="material-symbols:add" className="mr-2" />
                  {t("Add Key Point")}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {aboutItemsFields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="p-4 border border-gray-100 bg-gray-50/30 relative group"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAboutItem(index)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      <Iconify icon="material-symbols:delete-outline" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <MultiLingualInput
                        control={control}
                        baseName={`about_page.items[${index}].title`}
                        label={t("Point Title")}
                      />
                      <MultiLingualInput
                        control={control}
                        baseName={`about_page.items[${index}].description`}
                        label={t("Point Description")}
                        multiline
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </SectionHeader>

        {/* Contact Page Section */}
        <SectionHeader
          title={t("Contact Information")}
          isOpen={expandedSection === "contact"}
          onToggleCollapse={() => toggleSection("contact")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <MultiLingualInput
                control={control}
                baseName="contact_page.address"
                label={t("Street Address")}
              />
              <MultiLingualInput
                control={control}
                baseName="contact_page.address_city"
                label={t("City & Country")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-800">
                    {t("Phone Number")}
                  </Label>
                  <Controller
                    name="contact_page.phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          field.onChange(val);
                        }}
                        className="rounded-xl border-gray-200"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-800">
                    {t("Email Address")}
                  </Label>
                  <Controller
                    name="contact_page.email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        className="rounded-xl border-gray-200"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-800">
                  {t("Google Maps Link")}
                </Label>
                <Controller
                  name="contact_page.google_maps_link"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} className="rounded-xl border-gray-200" />
                  )}
                />
              </div>
              <Card className="p-4 bg-gray-50/50 border-none">
                <Label className="text-sm font-black uppercase text-gray-400 mb-4 block">
                  {t("Working Hours")}
                </Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      {t("Mon - Fri")}
                    </Label>
                    <Controller
                      name="contact_page.working_hours.mon_fri"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="bg-white border-gray-100"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      {t("Sat - Sun")}
                    </Label>
                    <Controller
                      name="contact_page.working_hours.sat_sun"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="bg-white border-gray-100"
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </SectionHeader>

        {/* Policies Section */}
        <SectionHeader
          title={t("Site Policies")}
          isActive={watch("policies.isActive")}
          onToggle={(val) => setValue("policies.isActive", val)}
          isOpen={expandedSection === "policies"}
          onToggleCollapse={() => toggleSection("policies")}
        >
          <div className="grid grid-cols-1 gap-8">
            {["terms", "returns", "shipping", "refund"].map((policyKey) => (
              <div
                key={policyKey}
                className="space-y-4 pb-4 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-xl font-bold text-gray-800 capitalize">
                    {t(policyKey.replace("_", " "))}
                  </Label>
                  <Controller
                    name={`policies.${policyKey}.isActive`}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <MultiLingualInput
                  control={control}
                  baseName={`policies.${policyKey}.text`}
                  label={t("Policy Content")}
                  multiline
                  disabled={!watch(`policies.${policyKey}.isActive`)}
                />
              </div>
            ))}
          </div>
        </SectionHeader>

        <div className="space-y-4">
          {/* Footer Section */}
          <SectionHeader
            title={t("Footer Settings")}
            isActive={watch("footer_settings.isActive")}
            onToggle={(val) => setValue("footer_settings.isActive", val)}
            isOpen={expandedSection === "footer"}
            onToggleCollapse={() => toggleSection("footer")}
          >
            <div className="space-y-6">
              <MultiLingualInput
                control={control}
                baseName="footer_settings.description"
                label={t("Footer Description")}
                multiline
              />
              <MultiLingualInput
                control={control}
                baseName="footer_settings.copyright"
                label={t("Copyright Text")}
              />
            </div>
          </SectionHeader>

          {/* Social Links Section */}
          <SectionHeader
            title={t("Social Media Links")}
            isOpen={expandedSection === "social"}
            onToggleCollapse={() => toggleSection("social")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Iconify
                    icon="simple-icons:facebook"
                    className="text-blue-600"
                    width={16}
                  />
                  {t("Facebook URL")}
                </Label>
                <Controller
                  name="social_links.facebook"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://facebook.com/yourpage"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (
                          value &&
                          !value.startsWith("http://") &&
                          !value.startsWith("https://")
                        ) {
                          field.onChange("https://" + value);
                        }
                      }}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Iconify
                    icon="simple-icons:instagram"
                    className="text-pink-600"
                    width={16}
                  />
                  {t("Instagram URL")}
                </Label>
                <Controller
                  name="social_links.instagram"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://instagram.com/yourpage"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (
                          value &&
                          !value.startsWith("http://") &&
                          !value.startsWith("https://")
                        ) {
                          field.onChange("https://" + value);
                        }
                      }}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Iconify
                    icon="simple-icons:x"
                    className="text-gray-900"
                    width={16}
                  />
                  {t("Twitter/X URL")}
                </Label>
                <Controller
                  name="social_links.twitter"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://x.com/yourpage"
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20"
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (
                          value &&
                          !value.startsWith("http://") &&
                          !value.startsWith("https://")
                        ) {
                          field.onChange("https://" + value);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </SectionHeader>

          {/* SEO Section */}
          <SectionHeader
            title={t("SEO & Metadata")}
            isOpen={expandedSection === "seo"}
            onToggleCollapse={() => toggleSection("seo")}
          >
            <div className="space-y-6">
              <MultiLingualInput
                control={control}
                baseName="seo.meta_title"
                label={t("Meta Title")}
              />
              <MultiLingualInput
                control={control}
                baseName="seo.meta_description"
                label={t("Meta Description")}
                multiline
              />
              <MultiLingualInput
                control={control}
                baseName="seo.meta_keywords"
                label={t("Meta Keywords")}
              />
              <Controller
                name="seo.og_image"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                      {t("OG Social Image")}
                    </Label>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
          </SectionHeader>
        </div>

        {/* Theme & Colors Section */}
        <SectionHeader
          title={t("Theme & Branding")}
          isOpen={expandedSection === "theme"}
          onToggleCollapse={() => toggleSection("theme")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "primary_color",
              "secondary_color",
              "accent_color",
              "bgColor",
            ].map((colorKey) => (
              <Card
                key={colorKey}
                className="p-4 border border-dashed border-gray-200 bg-gray-50/10"
              >
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">
                  {t(colorKey.replace("_", " "))}
                </Label>
                <Controller
                  name={`theme.${colorKey}`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-200 relative overflow-hidden shrink-0"
                        style={{ backgroundColor: field.value }}
                      >
                        <input
                          {...field}
                          type="color"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <Input
                        {...field}
                        className="grow bg-white border-gray-200 font-mono text-xs font-bold text-primary focus-visible:ring-primary/20"
                        placeholder="#000000"
                      />
                    </div>
                  )}
                />
              </Card>
            ))}
          </div>
        </SectionHeader>
      </form>
    </div>
  );
}
