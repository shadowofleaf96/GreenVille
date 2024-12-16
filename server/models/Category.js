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
  active: Joi.boolean(),
});

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      en: { type: String, required: true },
      fr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "Categories",
    versionKey: false,
  }
);

CategorySchema.pre("save", async function (next) {
  try {
    const validatedData = await CategoryJoiSchema.validateAsync(this.toObject());

    this.category_name = validatedData.category_name;
    this.active = validatedData.active;

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
