// Shadow Of Leaf Was Here

const { Product } = require("../models/Product");
const Review = require("../models/Review");
const { SubCategory } = require("../models/SubCategory");
const { Vendor } = require("../models/Vendor");

const createData = async (req, res) => {
  const product_images = req.files;

  if (!product_images || product_images.length === 0) {
    return res.status(400).json({ message: "No images uploaded." });
  }

  const imagePaths = product_images.map((file) => file.path);

  const {
    sku,
    product_name,
    subcategory_id,
    short_description,
    long_description,
    price,
    discount_price,
    option,
    quantity,
    status,
    on_sale,
    variants,
  } = req.body;

  const processedOption = Array.isArray(option) ? option[0] : option;

  let processedVariants = [];
  if (variants) {
    try {
      processedVariants =
        typeof variants === "string" ? JSON.parse(variants) : variants;
    } catch (e) {
      console.error("Error parsing variants", e);
      processedVariants = [];
    }
  }

  const product = new Product({
    sku,
    product_images: imagePaths,
    subcategory_id,
    product_name,
    short_description,
    long_description,
    price,
    discount_price,
    option: processedOption,
    quantity,
    status,
    on_sale,
    variants: processedVariants,
  });

  if (req.user && req.user.role === "vendor") {
    const vendorProfile = await Vendor.findOne({ user: req.user._id });
    if (vendorProfile) {
      product.vendor = vendorProfile._id;
    }
  }

  try {
    const savedProduct = await product.save();

    const subcategory = await SubCategory.findById(subcategory_id).lean();

    const enrichedProduct = {
      ...savedProduct.toObject(),
      subcategory: subcategory,
    };

    res.status(201).json({
      message: "Product created successfully",
      data: enrichedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
};

const searchingItems = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const { searchQuery } = req.query || "";

  try {
    const products = await Product.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .select("product_name product_images price variants")
      .populate({
        path: "subcategory_id",
        populate: { path: "category_id", select: "category_name" },
      })
      .lean()
      .exec();

    res.status(201).json({
      data: products,
    });
  } catch (error) {
    console.error("Error in searchingItems:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RetrievingItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let {
    sku,
    price,
    quantity,
    status,
    sortBy,
    sortOrder,
    category_id,
    subcategory_id,
    minPrice,
    maxPrice,
    option,
    search,
    onSale,
  } = req.query;

  sortBy = sortBy || "creation_date";
  sortOrder = sortOrder || "desc";

  try {
    let query = {};

    if (onSale === "true") {
      query.on_sale = true;
    }
    if (sku) {
      query.sku = { $regex: sku, $options: "i" };
    }
    if (status) {
      query.status = status === "true";
    }
    if (price) {
      query.price = Number(price);
    }
    if (quantity) {
      query.quantity = Number(quantity);
    }

    if (subcategory_id) {
      if (Array.isArray(subcategory_id)) {
        query.subcategory_id = { $in: subcategory_id };
      } else if (
        typeof subcategory_id === "string" &&
        subcategory_id.includes(",")
      ) {
        query.subcategory_id = { $in: subcategory_id.split(",") };
      } else {
        query.subcategory_id = subcategory_id;
      }
    }

    if (category_id && !subcategory_id) {
      let catIds = category_id;
      if (typeof category_id === "string" && category_id.includes(",")) {
        catIds = category_id.split(",");
      }

      const subcategories = await SubCategory.find({
        category_id: Array.isArray(catIds) ? { $in: catIds } : catIds,
      }).lean();
      const subcategoryIds = subcategories.map((sub) => sub._id);
      query.subcategory_id = { $in: subcategoryIds };
    }

    if (minPrice || maxPrice) {
      query.$or = [
        {
          discount_price: {
            $gte: Number(minPrice) || 0,
            $lte: Number(maxPrice) || 1000000,
          },
        },
        {
          price: {
            $gte: Number(minPrice) || 0,
            $lte: Number(maxPrice) || 1000000,
          },
        },
      ];
    }

    if (option) {
      query.option = option;
    }

    if (search) {
      query.$or = [
        { "product_name.en": { $regex: search, $options: "i" } },
        { "product_name.fr": { $regex: search, $options: "i" } },
        { "product_name.ar": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(query);

    let absoluteMaxPrice = 10000;
    if (
      global.maxPriceCache &&
      Date.now() - global.maxPriceCache.timestamp < 3600000
    ) {
      absoluteMaxPrice = global.maxPriceCache.value;
    } else {
      const maxPriceData = await Product.findOne({})
        .sort({ price: -1 })
        .select("price")
        .lean();
      if (maxPriceData) {
        absoluteMaxPrice = maxPriceData.price;
        global.maxPriceCache = {
          value: absoluteMaxPrice,
          timestamp: Date.now(),
        };
      }
    }

    let finalSortBy = sortBy;
    if (sortBy === "name") {
      finalSortBy = `product_name.${req.query.lng || "en"}`;
    }

    const products = await Product.find(query)
      .populate("vendor", "store_name store_logo")
      .populate({
        path: "subcategory_id",
        select: "subcategory_name category_id",
        populate: { path: "category_id", select: "category_name" },
      })
      .sort({ [finalSortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedProducts = products.map((product) => ({
      ...product,
      subcategory: product.subcategory_id,
      category: product.subcategory_id?.category_id,
    }));

    res.status(200).json({
      data: enrichedProducts,
      total,
      page,
      limit,
      maxPrice: absoluteMaxPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const categorySub = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: "subcategory_id",
        model: "Subcategory",
        select: "subcategory_name",
      })
      .lean();

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error in categorySub:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RetrieveById = async (req, res) => {
  const id = req.params.id;
  try {
    const productById = await Product.findById(id).lean();
    res.status(200).json({
      data: productById,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateProductById = async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  const product_images = req.files;

  newData.last_update = Date.now();

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Invalid product id" });
  }

  if (req.user.role === "vendor") {
    const vendorProfile = await Vendor.findOne({ user: req.user._id });

    if (!vendorProfile) {
      return res.status(403).json({ message: "Vendor profile not found" });
    }

    if (
      product.vendor &&
      product.vendor.toString() !== vendorProfile._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this product" });
    }
  }

  // if (!product_images || product_images.length === 0) {
  //   return res.status(400).json({ message: "No images uploaded." });
  // }

  if (product_images.length > 5) {
    return res.status(400).json({ message: "Maximum 5 images allowed." });
  }

  const imagePaths = product_images.map((file) => file.path);

  Object.keys(newData).forEach((key) => {
    const match = key.match(/^(.+)\[(.+)\]$/);
    if (match) {
      const field = match[1];
      const subField = match[2];

      newData[`${field}.${subField}`] = newData[key];
      delete newData[key];
    }
  });

  if (newData.variants) {
    try {
      newData.variants =
        typeof newData.variants === "string"
          ? JSON.parse(newData.variants)
          : newData.variants;
    } catch (e) {
      console.error("Error parsing variants in update", e);
    }
  }

  if (newData.option && typeof newData.option === "string") {
    newData.option = newData.option
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt);
  }

  if (newData.status) {
    newData.status = newData.status === "true";
  }
  if (newData.on_sale) {
    newData.on_sale = newData.on_sale === "true";
  }

  const updateData = {
    ...newData,
  };

  if (imagePaths && imagePaths.length > 0) {
    updateData.product_images = imagePaths;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const subcategory = await SubCategory.findById(
      newData.subcategory_id
    ).lean();

    const enrichedProduct = {
      ...updatedProduct.toObject(),
      subcategory: subcategory,
    };

    res.status(200).json({
      message: "Product edited successfully",
      data: enrichedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const DeleteProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const productById = await Product.findById(id)
      .populate("vendor", "store_name store_logo")
      .lean();

    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.user.role === "vendor") {
      const vendorProfile = await Vendor.findOne({ user: req.user._id });

      if (!vendorProfile) {
        return res.status(403).json({ message: "Vendor profile not found" });
      }

      if (
        productById.vendor &&
        productById.vendor.toString() !== vendorProfile._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this product" });
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { newRating, newComment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const product = await Product.findById(review.product);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldRating = review.rating || 0;
    const totalRating =
      (product.average_rating || 0) * (product.total_reviews || 0);
    const newAverageRating =
      (totalRating - oldRating + newRating) / (product.total_reviews || 1);

    review.rating = newRating;
    review.comment = newComment;
    await review.save();

    product.average_rating = newAverageRating.toFixed(1);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Review updated in product model successfully!",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: error.message });
  }
};

const getVendorProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const vendorProfile = await Vendor.findOne({ user: req.user._id });
    if (!vendorProfile) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const query = { vendor: vendorProfile._id };

    if (req.query.search) {
      query.$or = [
        { "product_name.en": { $regex: req.query.search, $options: "i" } },
        { "product_name.fr": { $regex: req.query.search, $options: "i" } },
        { "product_name.ar": { $regex: req.query.search, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate({
        path: "subcategory_id",
        populate: { path: "category_id" },
      })
      .sort({ creation_date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedProducts = products.map((product) => ({
      ...product,
      subcategory: product.subcategory_id,
      category: product.subcategory_id?.category_id,
    }));

    res.status(200).json({
      data: enrichedProducts,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createData,
  getVendorProducts,
  searchingItems,
  updateReview,
  RetrievingItems,
  categorySub,
  RetrieveById,
  UpdateProductById,
  DeleteProductById,
};
