const mongoose = require("mongoose");
const Joi = require("joi");

const LocalizationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    en: { type: mongoose.Schema.Types.Mixed, default: "" },
    fr: { type: mongoose.Schema.Types.Mixed, default: "" },
    ar: { type: mongoose.Schema.Types.Mixed, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const validateLocalization = (data) => {
  const schema = Joi.object({
    key: Joi.string().required(),
    en: Joi.alternatives().try(Joi.string(), Joi.object()).allow("").optional(),
    fr: Joi.alternatives().try(Joi.string(), Joi.object()).allow("").optional(),
    ar: Joi.alternatives().try(Joi.string(), Joi.object()).allow("").optional(),
  });
  return schema.validate(data);
};

const Localization = mongoose.model("Localization", LocalizationSchema);

module.exports = { Localization, validateLocalization };
