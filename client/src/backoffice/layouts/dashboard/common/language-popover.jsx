import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

import i18n from "../../../../locales/i18n";
import Iconify from "../../../components/iconify";

const LANGS = [
  {
    value: "en",
    labelKey: "language",
    name: "English",
    icon: (
      <Iconify
        icon="flagpack:gb-ukm"
      />
    ),
  },
  {
    value: "ar",
    labelKey: "language",
    name: "Arabic",
    icon: (
      <Iconify
        icon="flagpack:ma"
      />
    ),
  },
  {
    value: "fr",
    labelKey: "language",
    name: "French",
    icon: (
      <Iconify
        icon="flagpack:fr"
      />
    ),
  },
];

export default function LanguagePopover() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [icon, setIcon] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setLanguage(i18n.language);
    const initialIcon =
      LANGS.find((lang) => lang.value === i18n.language)?.icon ||
      LANGS.find((lang) => lang.value === "en")?.icon;
    setIcon(initialIcon || null);
  }, []);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLanguageChange = (option) => {
    i18n.changeLanguage(option.value);
    setLanguage(option.value);
    setIcon(option.icon);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        {icon}
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === language}
            onClick={() => handleLanguageChange(option)}
            sx={{ typography: "body2", py: 1 }}
          >
            <div className="mr-2 rtl:ml-2">{option.icon}</div>
            {t(option.name)}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
