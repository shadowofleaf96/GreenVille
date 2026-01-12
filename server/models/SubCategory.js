const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const SubCategoryJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  subcategory_name: Joi.object({
    en: Joi.string().required(),
    fr: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  category_id: Joi.any().required(),
  status: Joi.boolean(),
  subcategory_image: Joi.string().allow(""),
});

const subcategorieSchema = new Schema(
  {
    subcategory_name: {
      en: { type: String, trim: true, maxlength: 35, required: true },
      fr: { type: String, trim: true, maxlength: 35, required: true },
      ar: { type: String, trim: true, maxlength: 35, required: true },
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    subcategory_image: {
      type: String,
      default: "",
    },
  },
  {
    collection: "SubCategories",
    versionKey: false,
  }
);

subcategorieSchema.pre("save", async function (next) {
  try {
    const validatedData = await SubCategoryJoiSchema.validateAsync(
      this.toObject()
    );
    this.subcategory_name = validatedData.subcategory_name;
    this.category_id = validatedData.category_id;
    this.status = validatedData.status;
    this.subcategory_image = validatedData.subcategory_image;
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
