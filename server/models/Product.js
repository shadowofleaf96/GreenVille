const Joi = require("joi");
const mongoose = require("mongoose");

const productJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  sku: Joi.string().required(),
  product_images: Joi.array().items(Joi.string().uri()).optional(),
  product_name: Joi.object({
    en: Joi.string().required(),
    fr: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  subcategory_id: Joi.any().optional(),
  short_description: Joi.object({
    en: Joi.string().required(),
    fr: Joi.string().optional(),
    ar: Joi.string().optional(),
  }).optional(),
  long_description: Joi.object({
    en: Joi.string().required(),
    fr: Joi.string().optional(),
    ar: Joi.string().optional(),
  }).optional(),
  price: Joi.number().positive().required(),
  discount_price: Joi.number().positive().optional(),
  average_rating: Joi.number().optional(),
  total_reviews: Joi.number().optional(),
  quantity: Joi.number().integer().required(),
  option: Joi.array().items(Joi.string()).optional(),
  status: Joi.boolean().default(false),
  creation_date: Joi.number().optional(),
  last_update: Joi.number().optional(),
});

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
      en: { type: String, required: true },
      fr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategories",
    },
    short_description: {
      en: { type: String },
      fr: { type: String },
      ar: { type: String },
    },
    long_description: {
      en: { type: String },
      fr: { type: String },
      ar: { type: String },
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
    },
    option: Array,
    status: {
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
    average_rating: {
      type: Number,
      default: 0,
    },
    total_reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "Products",
    versionKey: false,
  }
);

productSchema.pre("save", async function (next) {
  try {
    await productJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
};
