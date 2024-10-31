const Joi = require("joi");
const { Schema, model, Types } = require("mongoose");

// Joi schema for subcategory validation
const subcategoryJoiSchema = Joi.object({
  id: Joi.any().strip(), // Ignore this field
  subcategory_name: Joi.string().trim().max(25).required(), // Required and max length 25
  category_id: Joi.string().required(), // Reference to Categories
  active: Joi.boolean().default(false), // Default to false
});

// Mongoose schema for subcategories
const subcategorieSchema = new Schema(
  {
    id: {
      type: String,
    },
    subcategory_name: {
      type: String,
      trim: true,
      maxlength: 25,
      required: true,
      unique: true,
    },
    category_id: {
      type: Types.ObjectId, // Use Types.ObjectId for better readability
      ref: "Categories",
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "SubCategories",
    versionKey: false,
  }
);

// Pre-save hook for validation
subcategorieSchema.pre("save", async function (next) {
  try {
    // Validate the subcategory data
    await subcategoryJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const SubCategories = model("SubCategories", subcategorieSchema);
if (SubCategories) {
  console.log("SubCategory Schema created");
} else {
  console.log("error");
}

module.exports = {
  SubCategories,
};
