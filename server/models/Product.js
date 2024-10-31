const Joi = require("joi");
const mongoose = require("mongoose");

// Joi schema for product validation
const productJoiSchema = Joi.object({
  sku: Joi.string().required(), // Required and unique
  product_images: Joi.array().items(Joi.string().uri()).optional(), // Array of image URLs
  product_name: Joi.string().required(), // Required and unique
  subcategory_id: Joi.string().optional(), // Reference to SubCategories
  short_description: Joi.string().optional(),
  long_description: Joi.string().optional(),
  price: Joi.number().positive().required(), // Required and positive number
  discount_price: Joi.number().positive().optional(), // Optional and positive number
  quantity: Joi.number().integer().min(0).required(), // Required and non-negative integer
  option: Joi.array().items(Joi.object()).optional(), // Array of options, adjust as needed
  active: Joi.boolean().default(false), // Default to false
  creation_date: Joi.number().optional(),
  last_update: Joi.number().optional(),
});

// Mongoose schema for products
const productSchema = mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    product_images: {
      type: [String],
    },
    product_name: {
      type: String,
      unique: true,
      required: true,
    },
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategories",
    },
    short_description: {
      type: String,
    },
    long_description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Ensure non-negative quantity
    },
    option: [Array],
    active: {
      type: Boolean,
      default: false,
    },
    creation_date: {
      type: Number,
      default: Date.now,
    },
    last_update: {
      type: Number,
      default: Date.now,
    },
  },
  {
    collection: "Products",
    versionKey: false,
  }
);

// Pre-save hook for validation
productSchema.pre("save", async function (next) {
  try {
    // Validate the product data
    await productJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", productSchema);
if (Product) {
  console.log("Product Schema created");
} else {
  console.log("error");
}

module.exports = {
  Product,
};
