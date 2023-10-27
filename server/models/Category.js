const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config()


// Define Joi schema for product data validation
const CategoryJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  category_name: Joi.string().required(),
  active: Joi.boolean(),
});

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true
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

// Add a pre-save hook to validate and sanitize data using Joi
CategorySchema.pre("save", async function (next) {
  try {
    // Validate the rest of the data against the Joi schema
    const validatedData = await CategoryJoiSchema.validateAsync(this.toObject());

    // Update the schema fields with validated data
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
  console.log("error");
}

module.exports = {
  Category,
};
