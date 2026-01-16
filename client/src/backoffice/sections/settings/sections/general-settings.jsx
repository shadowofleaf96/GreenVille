import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import SectionCard from "../components/section-card";
import MultilingualInput from "../components/multilingual-input";
import ImageUpload from "../../../../components/image-upload";

const GeneralSettings = ({
  control,
  watch,
  setValue,
  expandedSection,
  toggleSection,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
*      <SectionCard
        title={t("Website Title")}
        description={t("The name of your website displayed across all pages")}
        isOpen={expandedSection === "website_title"}
        onToggleCollapse={() => toggleSection("website_title")}
      >
        <MultilingualInput
          control={control}
          baseName="website_title"
          label={t("Website Title")}
          placeholder={{
            en: "My Store",
            fr: "Ma Boutique",
            ar: "متجري",
          }}
          showCharCount
          maxLength={100}
        />
      </SectionCard>

      {/* Logo */}
      <SectionCard
        title={t("Website Logo")}
        description={t("Upload your website logo (recommended: 200x60px)")}
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
              aspectRatio="auto"
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
                    className="flex-1 h-10 rounded-xl border-gray-200 focus-visible:ring-primary/20"
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
                    className="flex-1 h-10 rounded-xl border-gray-200 focus-visible:ring-primary/20"
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
                    className="flex-1 h-10 rounded-xl border-gray-200 focus-visible:ring-primary/20"
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
                    className="flex-1 h-10 rounded-xl border-gray-200 focus-visible:ring-primary/20"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default GeneralSettings;
