"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Iconify from "@/components/shared/iconify/iconify";

const MultilingualInput = ({
  control,
  baseName,
  label,
  multiline = false,
  disabled = false,
  placeholder,
  showCharCount = false,
  maxLength,
}) => {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState("en");

  const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "fr", label: "Français", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
  ];

  return (
    <div
      className={`space-y-3 ${
        disabled ? "opacity-50 pointer-events-none" : "opacity-100"
      } transition-opacity duration-300`}
    >
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold text-gray-800">{label}</Label>
        {showCharCount && (
          <Badge variant="outline" className="text-xs">
            {t("Character count")}
          </Badge>
        )}
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActiveLanguage(lang.code)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeLanguage === lang.code
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={activeLanguage === lang.code ? "block" : "hidden"}
          >
            <Controller
              name={`${baseName}.${lang.code}`}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {multiline ? (
                    <Textarea
                      {...field}
                      dir={lang.dir}
                      placeholder={placeholder?.[lang.code] || ""}
                      maxLength={maxLength}
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20 min-h-24 resize-none"
                    />
                  ) : (
                    <Input
                      {...field}
                      dir={lang.dir}
                      placeholder={placeholder?.[lang.code] || ""}
                      maxLength={maxLength}
                      className="rounded-xl border-gray-200 focus-visible:ring-primary/20 h-10"
                    />
                  )}
                  {showCharCount && field.value && (
                    <p className="text-xs text-gray-500 text-right">
                      {field.value.length}
                      {maxLength && ` / ${maxLength}`}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultilingualInput;
