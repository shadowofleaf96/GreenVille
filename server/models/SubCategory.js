const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const subcategoryJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  subcategory_name: Joi.object({
    en: Joi.string().trim().max(25).required(),
    fr: Joi.string().trim().max(25).required(),
    ar: Joi.string().trim().max(25).required(),
  }).required(),
  category_id: Joi.any().required(),
  status: Joi.boolean().default(false),
});

const subcategorieSchema = new Schema(
  {
    subcategory_name: {
      en: { type: String, trim: true, maxlength: 25, required: true },
      fr: { type: String, trim: true, maxlength: 25, required: true },
      ar: { type: String, trim: true, maxlength: 25, required: true },
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "SubCategories",
    versionKey: false,
  }
);

subcategorieSchema.pre("save", async function (next) {
  try {
    await subcategoryJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const SubCategory = model("SubCategories", subcategorieSchema);

if (SubCategory) {
  console.log("SubCategory Schema created");
} else {
  console.log("Error creating SubCategory model");
}

module.exports = {
  SubCategory,
};
