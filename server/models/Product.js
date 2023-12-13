// Shadow Of Leaf was Here

const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
    },
    product_image: {
      type: String,
    },
    product_name: {
      type: String,
      unique: true,
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
    },
    discount_price: {
      type: Number,
    },
    quantity: {
      type: Number,
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

const Product = mongoose.model("Product", productSchema);
if (Product) {
  console.log("Product Schema created");
} else {
  console.log("error");
}

module.exports = Product;
