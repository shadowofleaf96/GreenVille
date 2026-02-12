"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Iconify from "@/components/shared/iconify/iconify";
import ImageUpload from "@/admin/_components/image-upload";
import IconPicker from "@/admin/_components/icon-picker";
import {
  fetchSettings,
  updateSettings,
} from "@/store/slices/admin/settingsSlice";
import createAxiosInstance from "@/utils/axiosConfig";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";

import SettingsTabs from "@/admin/_components/settings-tabs";
import SettingsSearch from "@/admin/_components/settings-search";
import SettingsActions from "@/admin/_components/settings-actions";
import SectionCard from "@/admin/_components/section-card";
import MultilingualInput from "@/admin/_components/multilingual-input";
import { exportSettings, getDefaultSettings } from "@/utils/settings-export";
import { useUnsavedChangesWarning } from "@/admin/_hooks/use-settings-form";

export default function SettingsView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: settingsData, loading } = useSelector(
    (state) => state.adminSettings,
  );
  const [categories, setCategories] = useState([]);
  const [expandedSection, setExpandedSection] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [isDirty, setIsDirty] = useState(false);

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\\D/g, "");
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
    defaultValues: getDefaultSettings(),
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

  // Track form changes
  useEffect(() => {
    const subscription = watch(() => setIsDirty(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  // Warn on unsaved changes
  useUnsavedChangesWarning(isDirty);

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
            typeof cat === "object" ? cat._id : cat,
          ) || [],
        cta2: {
          ...settingsData.cta2,
          images: settingsData.cta2?.images?.length
            ? settingsData.cta2.images
            : ["", ""],
        },
        shipping_config:
          settingsData.shipping_config || getDefaultSettings().shipping_config,
        vat_config: settingsData.vat_config || getDefaultSettings().vat_config,
        payment_methods:
          settingsData.payment_methods || getDefaultSettings().payment_methods,
        translations: settingsData.translations || {},
      };
      reset(formData);
      setIsDirty(false);
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
    formData.append("policies", JSON.stringify(data?.policies));
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
      JSON.stringify(data.auth_settings || { auth_video_url: "" }),
    );

    if (data.auth_settings?.auth_video_url instanceof File) {
      formData.append("auth_video_file", data.auth_settings.auth_video_url);
    }
    formData.append(
      "shipping_config",
      JSON.stringify(data.shipping_config || {}),
    );
    formData.append("vat_config", JSON.stringify(data.vat_config || {}));
    formData.append(
      "payment_methods",
      JSON.stringify(data.payment_methods || {}),
    );
    formData.append("translations", JSON.stringify(data.translations || {}));

    await dispatch(updateSettings(formData));
    setIsDirty(false);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleExport = () => {
    const currentValues = watch();
    exportSettings(currentValues, `settings-backup-${Date.now()}.json`);
  };

  const handleImport = (data) => {
    reset(data);
    setIsDirty(true);
    toast.success(t("Settings imported successfully"));
  };

  const handleReset = () => {
    reset(getDefaultSettings());
    setIsDirty(true);
  };

  // Search sections
  const searchSections = useMemo(
    () => [
      {
        id: "general",
        title: t("General Settings"),
        description: t("Logo, title, theme"),
        onClick: () => setActiveTab("general"),
      },
      {
        id: "announcement",
        title: t("Announcement Bar"),
        description: t("Top banner message"),
        onClick: () => {
          setActiveTab("content");
          toggleSection("announcement");
        },
      },
      {
        id: "banner",
        title: t("Banner Slides"),
        description: t("Homepage carousel"),
        onClick: () => {
          setActiveTab("content");
          toggleSection("banner");
        },
      },
      {
        id: "benefits",
        title: t("Benefits Section"),
        description: t("Key selling points"),
        onClick: () => {
          setActiveTab("content");
          toggleSection("benefits");
        },
      },
      {
        id: "cta",
        title: t("Call to Action"),
        description: t("Primary promotion"),
        onClick: () => {
          setActiveTab("content");
          toggleSection("cta");
        },
      },
      {
        id: "testimonials",
        title: t("Testimonials"),
        description: t("Customer reviews"),
        onClick: () => {
          setActiveTab("content");
          toggleSection("testimonials");
        },
      },
      {
        id: "about",
        title: t("About Page"),
        description: t("Company bio content"),
        onClick: () => {
          setActiveTab("pages");
          toggleSection("about");
        },
      },
      {
        id: "contact",
        title: t("Contact Details"),
        description: t("Address, phone, hours"),
        onClick: () => {
          setActiveTab("pages");
          toggleSection("contact");
        },
      },
      {
        id: "policies",
        title: t("Site Policies"),
        description: t("Terms, returns, refund"),
        onClick: () => {
          setActiveTab("pages");
          toggleSection("policies");
        },
      },
      {
        id: "shipping",
        title: t("Shipping Configuration"),
        description: t("Delivery options"),
        onClick: () => {
          setActiveTab("ecommerce");
          toggleSection("shipping");
        },
      },
      {
        id: "seo",
        title: t("SEO Settings"),
        description: t("Meta tags, analytics"),
        onClick: () => setActiveTab("seo"),
      },
      {
        id: "advanced",
        title: t("Advanced Settings"),
        description: t("Auth, translations"),
        onClick: () => setActiveTab("advanced"),
      },
    ],
    [t],
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 max-w-400 mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
        <div>
          <h4 className="text-4xl font-black text-gray-900 tracking-tight">
            {t("Store Settings")}
          </h4>
          <p className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t("Your store configuration is up to date")}
          </p>
        </div>

        <SettingsActions
          onSave={handleSubmit(onSubmit)}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
          loading={loading}
          unsavedChanges={isDirty}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 xl:w-80 shrink-0">
          <div className="sticky top-10 space-y-6">
            <SettingsSearch sections={searchSections} />
            <SettingsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unsavedChanges={isDirty}
              vertical
            />

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Iconify icon="solar:info-circle-bold-duotone" width={24} />
                <span className="text-sm font-black uppercase tracking-wider">
                  {t("Pro Tip")}
                </span>
              </div>
              <p className="text-xs text-primary/70 font-bold leading-relaxed">
                {t(
                  "You can use Cmd/Ctrl + K to quickly search through all settings sections.",
                )}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Website Title */}
                <SectionCard
                  title={t("Website Title")}
                  description={t("The name of your website")}
                  isOpen={expandedSection === "website_title"}
                  onToggleCollapse={() => toggleSection("website_title")}
                >
                  <MultilingualInput
                    control={control}
                    baseName="website_title"
                    label={t("Website Title")}
                    showCharCount
                    maxLength={100}
                  />
                </SectionCard>

                {/* Logo */}
                <SectionCard
                  title={t("Website Logo")}
                  description={t("Upload your website logo")}
                  isOpen={expandedSection === "logo"}
                  onToggleCollapse={() => toggleSection("logo")}
                >
                  <Controller
                    name="logo_url"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label={t("Logo Image")}
                      />
                    )}
                  />
                </SectionCard>

                {/* Theme Colors */}
                <SectionCard
                  title={t("Theme Colors")}
                  description={t("Customize your website's color scheme")}
                  isOpen={expandedSection === "theme"}
                  onToggleCollapse={() => toggleSection("theme")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="theme.primary_color"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-800">
                            {t("Primary Color")}
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              type="color"
                              {...field}
                              className="w-20 h-10 rounded-xl cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="flex-1 h-10 rounded-xl"
                              placeholder="#15803d"
                            />
                          </div>
                        </div>
                      )}
                    />

                    <Controller
                      name="theme.secondary_color"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-800">
                            {t("Secondary Color")}
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              type="color"
                              {...field}
                              className="w-20 h-10 rounded-xl cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="flex-1 h-10 rounded-xl"
                              placeholder="#eab308"
                            />
                          </div>
                        </div>
                      )}
                    />

                    <Controller
                      name="theme.accent_color"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-800">
                            {t("Accent Color")}
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              type="color"
                              {...field}
                              className="w-20 h-10 rounded-xl cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="flex-1 h-10 rounded-xl"
                              placeholder="#fefce8"
                            />
                          </div>
                        </div>
                      )}
                    />

                    <Controller
                      name="theme.bgColor"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-800">
                            {t("Background Color")}
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              type="color"
                              {...field}
                              className="w-20 h-10 rounded-xl cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="flex-1 h-10 rounded-xl"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </SectionCard>
              </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === "content" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Announcement Bar */}
                <SectionCard
                  title={t("Announcement Bar")}
                  description={t(
                    "Display a promotional message at the top of the site",
                  )}
                  isActive={watch("announcement.isActive")}
                  onToggle={(val) => setValue("announcement.isActive", val)}
                  isOpen={expandedSection === "announcement"}
                  onToggleCollapse={() => toggleSection("announcement")}
                >
                  <MultilingualInput
                    control={control}
                    baseName="announcement.text"
                    label={t("Announcement Message")}
                    disabled={!watch("announcement.isActive")}
                  />
                </SectionCard>

                {/* Banner Slides */}
                <SectionCard
                  title={t("Banner Slides")}
                  description={t("Manage homepage carousel slides")}
                  badge={bannerFields.length}
                  isActive={watch("banner_active")}
                  onToggle={(val) => setValue("banner_active", val)}
                  isOpen={expandedSection === "banner"}
                  onToggleCollapse={() => toggleSection("banner")}
                >
                  <div
                    className={`space-y-6 ${!watch("banner_active") ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {bannerFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group animate-in slide-in-from-left-2 duration-300"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBanner(index)}
                          className="absolute -top-3 -right-3 bg-white shadow-md border border-gray-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Iconify
                            icon="solar:trash-bin-trash-bold"
                            width={18}
                          />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          <div className="md:col-span-4">
                            <Controller
                              name={`banner_slides[${index}].image`}
                              control={control}
                              render={({ field }) => (
                                <ImageUpload
                                  value={field.value}
                                  onChange={field.onChange}
                                  label={t("Slide Image")}
                                />
                              )}
                            />
                          </div>
                          <div className="md:col-span-8 space-y-4">
                            <MultilingualInput
                              control={control}
                              baseName={`banner_slides[${index}].title`}
                              label={t("Slide Title")}
                            />
                            <MultilingualInput
                              control={control}
                              baseName={`banner_slides[${index}].subtitle`}
                              label={t("Slide Subtitle")}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <MultilingualInput
                                control={control}
                                baseName={`banner_slides[${index}].buttonText`}
                                label={t("Button Text")}
                              />
                              <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  {t("Button Link")}
                                </Label>
                                <Controller
                                  name={`banner_slides[${index}].link`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      className="h-9 rounded-xl border-gray-200"
                                      placeholder="/products"
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      className="w-full border-2 border-dashed h-14 rounded-2xl text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-xs uppercase font-black tracking-widest gap-2"
                    >
                      <Iconify icon="solar:add-circle-bold" width={20} />
                      {t("Add New Banner Slide")}
                    </Button>
                  </div>
                </SectionCard>

                {/* Benefits Section */}
                <SectionCard
                  title={t("Benefits Section")}
                  description={t("Display key selling points with icons")}
                  badge={benefitFields.length}
                  isActive={watch("benefits_active")}
                  onToggle={(val) => setValue("benefits_active", val)}
                  isOpen={expandedSection === "benefits"}
                  onToggleCollapse={() => toggleSection("benefits")}
                >
                  <div
                    className={`space-y-6 ${!watch("benefits_active") ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {benefitFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative group transition-all hover:shadow-sm"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBenefit(index)}
                            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 rounded-full w-7 h-7"
                          >
                            <Iconify
                              icon="solar:trash-bin-trash-bold"
                              width={16}
                            />
                          </Button>

                          <div className="flex gap-4">
                            <div className="w-16">
                              <Controller
                                name={`benefits[${index}].icon`}
                                control={control}
                                render={({ field }) => (
                                  <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                            <div className="flex-1 space-y-4">
                              <MultilingualInput
                                control={control}
                                baseName={`benefits[${index}].title`}
                                label={t("Title")}
                              />
                              <MultilingualInput
                                control={control}
                                baseName={`benefits[${index}].description`}
                                label={t("Description")}
                                multiline
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        appendBenefit({
                          icon: "solar:star-bold",
                          title: { en: "", fr: "", ar: "" },
                          description: { en: "", fr: "", ar: "" },
                        })
                      }
                      className="w-full border-2 border-dashed h-12 rounded-2xl text-gray-500 hover:text-primary gap-2 transition-all font-bold text-sm"
                    >
                      <Iconify icon="solar:add-circle-bold" width={20} />
                      {t("Add Benefit Point")}
                    </Button>
                  </div>
                </SectionCard>

                {/* CTA 1 */}
                <SectionCard
                  title={t("Call to Action (CTA)")}
                  description={t("Primary promotional section on homepage")}
                  isActive={watch("cta.isActive")}
                  onToggle={(val) => setValue("cta.isActive", val)}
                  isOpen={expandedSection === "cta"}
                  onToggleCollapse={() => toggleSection("cta")}
                >
                  <div
                    className={`grid grid-cols-1 md:grid-cols-12 gap-10 ${!watch("cta.isActive") ? "opacity-50 pointer-events-none" : ""}`}
                  >
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MultilingualInput
                          control={control}
                          baseName="cta.title_part1"
                          label={t("Title (Line 1)")}
                        />
                        <MultilingualInput
                          control={control}
                          baseName="cta.title_part2"
                          label={t("Title (Line 2)")}
                        />
                      </div>
                      <MultilingualInput
                        control={control}
                        baseName="cta.description"
                        label={t("Description")}
                        multiline
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                        <div className="space-y-4">
                          <MultilingualInput
                            control={control}
                            baseName="cta.primary_button_text"
                            label={t("Primary Button Text")}
                          />
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {t("Primary Link")}
                            </Label>
                            <Controller
                              name="cta.primary_button_link"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} className="h-9 rounded-xl" />
                              )}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <MultilingualInput
                            control={control}
                            baseName="cta.secondary_button_text"
                            label={t("Secondary Button Text")}
                          />
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {t("Secondary Link")}
                            </Label>
                            <Controller
                              name="cta.secondary_button_link"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} className="h-9 rounded-xl" />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* CTA 2 */}
                <SectionCard
                  title={t("Featured Promotion (CTA 2)")}
                  description={t(
                    "Secondary promotion section with multiple images",
                  )}
                  isActive={watch("cta2.isActive")}
                  onToggle={(val) => setValue("cta2.isActive", val)}
                  isOpen={expandedSection === "cta2"}
                  onToggleCollapse={() => toggleSection("cta2")}
                >
                  <div
                    className={`space-y-8 ${!watch("cta2.isActive") ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <MultilingualInput
                          control={control}
                          baseName="cta2.heading"
                          label={t("Section Heading")}
                        />
                        <MultilingualInput
                          control={control}
                          baseName="cta2.paragraph"
                          label={t("Promotion Paragraph")}
                          multiline
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <MultilingualInput
                            control={control}
                            baseName="cta2.link_text"
                            label={t("Link Text")}
                          />
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 tracking-widest uppercase">
                              {t("Url")}
                            </Label>
                            <Controller
                              name="cta2.link_url"
                              control={control}
                              render={({ field }) => (
                                <Input {...field} className="h-9 rounded-xl" />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[0, 1].map((idx) => (
                          <div
                            key={idx}
                            className="space-y-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100"
                          >
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {t("Promo Image")} {idx + 1}
                            </Label>
                            <Controller
                              name={`cta2.images[${idx}]`}
                              control={control}
                              render={({ field }) => (
                                <ImageUpload
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Testimonials */}
                <SectionCard
                  title={t("Testimonials")}
                  description={t("Customer success stories")}
                  badge={testimonialFields.length}
                  isActive={watch("testimonials_active")}
                  onToggle={(val) => setValue("testimonials_active", val)}
                  isOpen={expandedSection === "testimonials"}
                  onToggleCollapse={() => toggleSection("testimonials")}
                >
                  <div
                    className={`space-y-6 ${!watch("testimonials_active") ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonialFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group transition-all hover:shadow-md hover:bg-white"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTestimonial(index)}
                            className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Iconify
                              icon="solar:trash-bin-trash-bold"
                              width={18}
                            />
                          </Button>
                          <div className="space-y-4">
                            <Iconify
                              icon="solar:quote-bold-duotone"
                              width={32}
                              className="text-primary/20"
                            />
                            <MultilingualInput
                              control={control}
                              baseName={`testimonials[${index}].quote`}
                              label={t("Testimonial Quote")}
                              multiline
                            />
                            <MultilingualInput
                              control={control}
                              baseName={`testimonials[${index}].attribution`}
                              label={t("Customer Name/Role")}
                            />
                          </div>
                        </div>
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
                      className="w-full border-2 border-dashed h-12 rounded-2xl text-gray-500 hover:text-primary gap-2 transition-all font-bold"
                    >
                      <Iconify icon="solar:add-circle-bold" width={20} />
                      {t("Add Testimonial")}
                    </Button>
                  </div>
                </SectionCard>

                {/* Home Categories */}
                <SectionCard
                  title={t("Home Categories")}
                  description={t(
                    "Select categories to highlight on the homepage",
                  )}
                  isActive={watch("home_categories_active")}
                  onToggle={(val) => setValue("home_categories_active", val)}
                  isOpen={expandedSection === "home_categories"}
                  onToggleCollapse={() => toggleSection("home_categories")}
                >
                  <div
                    className={`space-y-4 ${!watch("home_categories_active") ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <Label className="text-sm font-bold text-gray-800">
                      {t("Selected Categories")}
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {(categories || []).filter(Boolean).map((category) => (
                        <div
                          key={category._id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            (watch("home_categories") || []).includes(
                              category?._id,
                            )
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                          onClick={() => {
                            const current = watch("home_categories") || [];
                            const newValue = current.includes(category?._id)
                              ? current.filter((id) => id !== category?._id)
                              : [...current, category?._id];
                            setValue("home_categories", newValue);
                          }}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              (watch("home_categories") || []).includes(
                                category?._id,
                              )
                                ? "bg-primary border-primary"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {(watch("home_categories") || []).includes(
                              category?._id,
                            ) && (
                              <Iconify
                                icon="ic:baseline-check"
                                className="text-white w-3 h-3"
                              />
                            )}
                          </div>
                          <span className="text-xs font-bold text-gray-700 truncate capitalize">
                            {category?.category_name?.en ||
                              t("Unnamed Category")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* PAGES TAB */}
            {activeTab === "pages" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* About Page */}
                <SectionCard
                  title={t("About Page")}
                  description={t("Content for the company bio page")}
                  isOpen={expandedSection === "about"}
                  onToggleCollapse={() => toggleSection("about")}
                >
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MultilingualInput
                        control={control}
                        baseName="about_page.title"
                        label={t("Hero Title")}
                      />
                      <MultilingualInput
                        control={control}
                        baseName="about_page.subtitle"
                        label={t("Hero Subtitle")}
                      />
                    </div>
                    <MultilingualInput
                      control={control}
                      baseName="about_page.description"
                      label={t("Main Description")}
                      multiline
                    />

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                          {t("Key Points")}
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
                          className="rounded-xl font-bold"
                        >
                          <Iconify
                            icon="solar:add-circle-bold"
                            className="mr-2"
                          />
                          {t("Add Point")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {aboutItemsFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group animate-in slide-in-from-bottom-2 duration-300"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAboutItem(index)}
                              className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Iconify
                                icon="solar:trash-bin-trash-bold"
                                width={18}
                              />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <MultilingualInput
                                control={control}
                                baseName={`about_page.items[${index}].title`}
                                label={t("Point Title")}
                              />
                              <MultilingualInput
                                control={control}
                                baseName={`about_page.items[${index}].description`}
                                label={t("Point Description")}
                                multiline
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Contact Information */}
                <SectionCard
                  title={t("Contact Information")}
                  description={t(
                    "Details for your contact page and store locations",
                  )}
                  isOpen={expandedSection === "contact"}
                  onToggleCollapse={() => toggleSection("contact")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <MultilingualInput
                        control={control}
                        baseName="contact_page.address"
                        label={t("Street Address")}
                      />
                      <MultilingualInput
                        control={control}
                        baseName="contact_page.address_city"
                        label={t("City, Country")}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                value={formatPhone(field.value)}
                                onChange={(e) => field.onChange(e.target.value)}
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
                            <Input
                              {...field}
                              className="rounded-xl border-gray-200"
                            />
                          )}
                        />
                      </div>
                      <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col gap-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          {t("Store Working Hours")}
                        </Label>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500">
                              {t("Monday - Friday")}
                            </span>
                            <Controller
                              name="contact_page.working_hours.mon_fri"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  className="h-9 rounded-xl border-gray-100"
                                />
                              )}
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500">
                              {t("Saturday - Sunday")}
                            </span>
                            <Controller
                              name="contact_page.working_hours.sat_sun"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  className="h-9 rounded-xl border-gray-100"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                {/* Site Policies */}
                <SectionCard
                  title={t("Site Policies")}
                  description={t(
                    "Terms, returns, shipping, and refund policies",
                  )}
                  isActive={watch("policies.isActive")}
                  onToggle={(val) => setValue("policies.isActive", val)}
                  isOpen={expandedSection === "policies"}
                  onToggleCollapse={() => toggleSection("policies")}
                >
                  <div
                    className={`space-y-8 ${!watch("policies.isActive") ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {["terms", "returns", "shipping", "refund"].map(
                      (policyKey) => (
                        <div
                          key={policyKey}
                          className="space-y-4 pb-6 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-lg font-bold text-gray-800 capitalize">
                              {t(policyKey)}
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
                          <MultilingualInput
                            control={control}
                            baseName={`policies.${policyKey}.text`}
                            label={t("Policy Text")}
                            multiline
                            disabled={!watch(`policies.${policyKey}.isActive`)}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </SectionCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Social Links */}
                  <SectionCard
                    title={t("Social Media")}
                    description={t("Connect your store with social platforms")}
                    isOpen={expandedSection === "social"}
                    onToggleCollapse={() => toggleSection("social")}
                  >
                    <div className="space-y-4">
                      {["facebook", "instagram", "twitter"].map((platform) => (
                        <div key={platform} className="space-y-2">
                          <Label className="text-xs font-bold text-gray-700 flex items-center gap-2 capitalize">
                            <Iconify
                              icon={`simple-icons:${platform}`}
                              className={
                                platform === "facebook"
                                  ? "text-blue-600"
                                  : platform === "instagram"
                                    ? "text-pink-600"
                                    : "text-sky-500"
                              }
                            />
                            {platform} URL
                          </Label>
                          <Controller
                            name={`social_links.${platform}`}
                            control={control}
                            render={({ field }) => (
                              <Input {...field} className="h-10 rounded-xl" />
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  {/* Footer Settings */}
                  <SectionCard
                    title={t("Footer Settings")}
                    description={t("Customize the bottom of your website")}
                    isActive={watch("footer_settings.isActive")}
                    onToggle={(val) =>
                      setValue("footer_settings.isActive", val)
                    }
                    isOpen={expandedSection === "footer"}
                    onToggleCollapse={() => toggleSection("footer")}
                  >
                    <div
                      className={`space-y-6 ${!watch("footer_settings.isActive") ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <MultilingualInput
                        control={control}
                        baseName="footer_settings.description"
                        label={t("Footer About Text")}
                        multiline
                      />
                      <MultilingualInput
                        control={control}
                        baseName="footer_settings.copyright"
                        label={t("Copyright Text")}
                      />
                    </div>
                  </SectionCard>
                </div>
              </div>
            )}
            {/* E-COMMERCE TAB */}
            {activeTab === "ecommerce" && (
              <div className="space-y-4">
                {/* Shipping Configuration */}
                <SectionCard
                  title={t("Shipping Configuration")}
                  description={t("Configure shipping options and costs")}
                  isOpen={expandedSection === "shipping_config"}
                  onToggleCollapse={() => toggleSection("shipping_config")}
                >
                  <div className="space-y-6">
                    {/* Free Shipping */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                      <div className="space-y-1">
                        <Label className="text-base font-bold text-gray-800 tracking-tight">
                          {t("Free Shipping Feature")}
                        </Label>
                        <p className="text-xs text-gray-500 font-medium">
                          {t(
                            "Enable or disable free shipping based on order total.",
                          )}
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
                                "Cart total must be above this amount for free shipping.",
                              )}
                            </p>
                          </div>
                        )}
                      />
                    </div>

                    {/* Shipping Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-100">
                      {/* Standard Shipping */}
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
                                !watch(
                                  "shipping_config.standard_shipping_enabled",
                                )
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

                      {/* Express Shipping */}
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
                                !watch(
                                  "shipping_config.express_shipping_enabled",
                                )
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

                      {/* Overnight Shipping */}
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
                                !watch(
                                  "shipping_config.overnight_shipping_enabled",
                                )
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
                  </div>
                </SectionCard>

                {/* Tax & Payment Configuration */}
                <SectionCard
                  title={t("Tax & Payment Configuration")}
                  description={t("Configure tax and payment methods")}
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
                                {t(
                                  "This percentage will be applied to the subtotal.",
                                )}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === "seo" && (
              <div className="space-y-4">
                <SectionCard
                  title={t("SEO Settings")}
                  description={t(
                    "Configure meta tags and search engine optimization",
                  )}
                  isOpen={expandedSection === "seo"}
                  onToggleCollapse={() => toggleSection("seo")}
                >
                  <div className="space-y-6">
                    <MultilingualInput
                      control={control}
                      baseName="seo.meta_title"
                      label={t("Meta Title")}
                      showCharCount
                      maxLength={60}
                    />

                    <MultilingualInput
                      control={control}
                      baseName="seo.meta_description"
                      label={t("Meta Description")}
                      multiline
                      showCharCount
                      maxLength={160}
                    />

                    <MultilingualInput
                      control={control}
                      baseName="seo.meta_keywords"
                      label={t("Meta Keywords")}
                      placeholder={{
                        en: "keyword1, keyword2, keyword3",
                        fr: "mot-clÃ©1, mot-clÃ©2, mot-clÃ©3",
                        ar: "ÙƒÙ„Ù…Ø©1ØŒ ÙƒÙ„Ù…Ø©2ØŒ ÙƒÙ„Ù…Ø©3",
                      }}
                    />

                    <Controller
                      name="seo.og_image"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-800">
                            {t("Open Graph Image")}
                          </Label>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label={t("OG Image (1200x630px recommended)")}
                          />
                        </div>
                      )}
                    />
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ADVANCED TAB */}
            {activeTab === "advanced" && (
              <div className="space-y-4">
                <SectionCard
                  title={t("Authentication Pages Settings")}
                  description={t("Configure background media for auth pages")}
                  isOpen={expandedSection === "auth_settings"}
                  onToggleCollapse={() => toggleSection("auth_settings")}
                >
                  <Controller
                    name="auth_settings.auth_video_url"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-4">
                        <Label className="text-base font-bold text-gray-800 uppercase tracking-tight">
                          {t("Authentication Video/Image URL")}
                        </Label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-gray-500 uppercase">
                              {t("Upload File")}
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
                              {t("Or Direct URL")}
                            </Label>
                            <Input
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
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
                              const isImage = isFile
                                ? val.type.startsWith("image/")
                                : typeof val === "string" &&
                                  val.match(
                                    /\.(jpeg|jpg|gif|png|webp|svg|avif)$/i,
                                  );

                              if (isImage) {
                                return (
                                  <img
                                    src={
                                      isFile ? URL.createObjectURL(val) : val
                                    }
                                    alt="Auth Background"
                                    className="w-full h-full object-cover"
                                  />
                                );
                              } else {
                                return (
                                  <video
                                    src={
                                      isFile ? URL.createObjectURL(val) : val
                                    }
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
                            <Iconify
                              icon="eva:checkmark-circle-2-fill"
                              width={20}
                            />
                            {t("File selected")}: {field.value.name}
                          </div>
                        )}

                        <p className="text-xs text-gray-500 font-medium ml-1">
                          {t(
                            "Upload a video or enter a URL for all authentication pages.",
                          )}
                        </p>
                      </div>
                    )}
                  />
                </SectionCard>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
