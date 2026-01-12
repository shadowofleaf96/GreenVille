import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import i18n from "../../../../locales/i18n";
import Iconify from "../../../components/iconify";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGS = [
  {
    value: "en",
    labelKey: "language",
    name: "English",
    icon: <Iconify icon="flagpack:gb-ukm" width={24} />,
  },
  {
    value: "ar",
    labelKey: "language",
    name: "Arabic",
    icon: <Iconify icon="flagpack:ma" width={24} />,
  },
  {
    value: "fr",
    labelKey: "language",
    name: "French",
    icon: <Iconify icon="flagpack:fr" width={24} />,
  },
];

export default function LanguagePopover() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    setLanguage(i18n.language);
    const initialIcon =
      LANGS.find((lang) => lang.value === i18n.language)?.icon ||
      LANGS.find((lang) => lang.value === "en")?.icon;
    setIcon(initialIcon || null);
  }, []);

  const handleLanguageChange = (option) => {
    i18n.changeLanguage(option.value);
    setLanguage(option.value);
    setIcon(option.icon);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-12 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center overflow-hidden"
        >
          <div className="scale-125">{icon}</div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 border-none shadow-xl">
        {LANGS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLanguageChange(option)}
            className={`
              cursor-pointer py-2 px-3 rounded-lg transition-colors
              ${
                option.value === language
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <div className="mr-3 shrink-0">{option.icon}</div>
            <span className="text-sm">{t(option.name)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
