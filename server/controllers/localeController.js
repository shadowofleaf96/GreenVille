const { Localization } = require("../models/Localization");

const getLocale = async (req, res) => {
  try {
    const { lng } = req.params;
    // Find all documents and project only the key and the requested language field
    const localizations = await Localization.find({}, `key ${lng}`);

    const translations = {};
    localizations.forEach((loc) => {
      // Access either loc[lng] or loc.get(lng) if using Map/Mixed
      translations[loc.key] = loc[lng] || "";
    });

    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLocale,
};
