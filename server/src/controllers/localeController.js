import { Localization } from "../models/Localization.js";

export const getLocale = async (req, res) => {
  const { lng } = req.params;
  // Find all documents and project only the key and the requested language field
  const localizations = await Localization.find({}, `key ${lng}`);

  const translations = {};
  localizations.forEach((loc) => {
    // Access either loc[lng] or loc.get(lng) if using Map/Mixed
    translations[loc.key] = loc[lng] || "";
  });

  res.status(200).json(translations);
};
