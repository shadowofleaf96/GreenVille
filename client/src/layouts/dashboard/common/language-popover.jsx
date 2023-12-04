import { useState } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

import i18n from "../../../locales/i18n";

const LANGS = [
  {
    value: "en",
    labelKey: "language",
    name: "English",
    icon: "/assets/icons/ic_flag_en.svg",
  },
  {
    value: "ar",
    labelKey: "language",
    name: "Arabic",
    icon: "/assets/icons/ic_flag_ar.svg",
  },
  {
    value: "fr",
    labelKey: "language",
    name: "French",
    icon: "/assets/icons/ic_flag_fr.svg",
  },
];

export default function LanguagePopover() {
  const [language, setLanguage] = useState(i18n.language); // Initial language state
  const [icon, setIcon] = useState(LANGS.find((lang) => lang.value === language).icon); // Initial icon state

  const { t } = useTranslation();
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLanguageChange = (option) => {
    i18n.changeLanguage(option.value);
    setLanguage(option.value); // Update language state
    setIcon(option.icon); // Update icon state
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <img src={icon} alt={t(LANGS[0].labelKey)} />
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
            <Box component="img" alt={t(option.labelKey)} src={option.icon} sx={{ width: 28, mr: 2 }} />
            {t(option.name)}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
