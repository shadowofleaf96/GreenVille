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
  vendor: Joi.any().optional(),
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
  variants: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().strip(),
        variant_name: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().integer().required(),
        sku: Joi.string().required(),
      })
    )
    .optional(),
  on_sale: Joi.boolean().default(false),
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
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendors",
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
    on_sale: {
      type: Boolean,
      default: false,
    },
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
    variants: {
      type: [
        {
          variant_name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          sku: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    collection: "Products",
    versionKey: false,
  }
);

productSchema.index({ subcategory_id: 1 });
productSchema.index({ status: 1, subcategory_id: 1 });
productSchema.index({ status: 1, on_sale: 1 });
productSchema.index({ status: 1, creation_date: -1 });
productSchema.index({ status: 1, price: 1 });
productSchema.index({ vendor: 1, status: 1 });

productSchema.index(
  {
    "product_name.en": "text",
    "product_name.fr": "text",
    "product_name.ar": "text",
  },
  {
    weights: {
      "product_name.en": 10,
      "product_name.fr": 5,
      "product_name.ar": 5,
    },
    name: "ProductSearchIndex",
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
