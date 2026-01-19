import { Localization, validateLocalization } from "../models/Localization.js";

// Get all translations
export const getAllLocalizations = async (req, res) => {
  const localizations = await Localization.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: localizations });
};

// Create or Update a translation
export const upsertLocalization = async (req, res) => {
  const { error } = validateLocalization(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  const { key, en, fr, ar } = req.body;

  let localization = await Localization.findOne({ key });

  if (localization) {
    // Update existing
    localization.en = en !== undefined ? en : localization.en;
    localization.fr = fr !== undefined ? fr : localization.fr;
    localization.ar = ar !== undefined ? ar : localization.ar;
    await localization.save();
    return res.status(200).json({
      success: true,
      message: "Translation updated",
      data: localization,
    });
  } else {
    // Create new
    localization = new Localization({ key, en, fr, ar });
    await localization.save();
    return res.status(201).json({
      success: true,
      message: "Translation added",
      data: localization,
    });
  }
};

// Delete a translation
export const deleteLocalization = async (req, res) => {
  const { id } = req.params;

  const localization = await Localization.findByIdAndDelete(id);

  if (!localization) {
    return res
      .status(404)
      .json({ success: false, message: "Translation not found" });
  }

  res.status(200).json({ success: true, message: "Translation deleted" });
};
