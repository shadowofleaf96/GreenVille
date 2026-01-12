const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const CategoryJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  category_name: Joi.object({
    en: Joi.string().required(),
    fr: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  status: Joi.boolean(),
  category_image: Joi.string().allow(""),
});

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      en: { type: String, trim: true, maxlength: 35, required: true },
      fr: { type: String, trim: true, maxlength: 35, required: true },
      ar: { type: String, trim: true, maxlength: 35, required: true },
    },
    status: {
      type: Boolean,
      default: false,
    },
    category_image: {
      type: String,
      default: "",
    },
  },
  {
    collection: "Categories",
    versionKey: false,
  }
);

CategorySchema.pre("save", async function (next) {
  try {
    const validatedData = await CategoryJoiSchema.validateAsync(
      this.toObject()
    );

    this.category_name = validatedData.category_name;
    this.status = validatedData.status;

    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Categories", CategorySchema);

if (Category) {
  console.log("Category Schema created");
} else {
  console.log("Error creating Category model");
}

module.exports = {
  Category,
};
