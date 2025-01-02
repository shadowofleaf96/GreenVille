// Shadow Of Leaf Was Here

const { Product } = require("../models/Product");
const Review = require("../models/Review");
const { SubCategory } = require("../models/SubCategory");
const { Category } = require("../models/Category");

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
  } = req.body;

  const processedOption = Array.isArray(option) ? option[0] : option;

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
  });

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
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const { searchQuery } = req.query || "";

  try {
    const products = await Product.find({
      product_name: { $regex: searchQuery, $options: "i" },
    })
      .skip(skip)
      .limit(limit)
      .select("product_name product_images price")
      .populate({
        path: "subcategory_id",
        populate: { path: "category_id", select: "category_name" },
      })
      .exec();

    res.status(201).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RetrievingItems = async (req, res) => {
  const page = parseInt(req.query.page);
  const perPage = 10;

  try {
    let query = Product.find().lean();

    if (page) {
      query = query.skip((page - 1) * perPage).limit(perPage);
    }

    const productPage = await query;

    const subcategoryPromises = productPage.map((product) =>
      SubCategory.findById(product.subcategory_id).lean()
    );
    const subcategories = await Promise.all(subcategoryPromises);

    const enrichedProducts = productPage.map((product, index) => {
      const subcategory = subcategories[index];
      return {
        ...product,
        subcategory: subcategory,
      };
    });

    res.status(201).json({
      data: enrichedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const categorySub = (req, res) => {
  Product.find({})
    .populate({
      path: "subcategory_id",
      model: "Subcategory",
      select: "subcategory_name",
    })
    .exec((err, product) => {
      if (err) {
      } else {
        console.log(product.subcategory_id.subcategory_name);
      }
    });
};

const RetrieveById = async (req, res) => {
  const id = req.params.id;
  try {
    const productById = await Product.findById(id);

    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }

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

  // if (!product_images || product_images.length === 0) {
  //   return res.status(400).json({ message: "No images uploaded." });
  // }

  if (product_images.length > 5) {
    return res.status(400).json({ message: "Maximum 5 images allowed." });
  }

  const imagePaths = product_images.map((file) => file.path);

  const updateData = {
    product_images: imagePaths,
    ...newData,
  };

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
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found" });
    }

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

    try {
      const review = await Review.findById(reviewId);
      if (!review) throw new Error("Review not found");

      const product = await Product.findById(review.product);
      if (!product) throw new Error("Product not found");

      const oldRating = review.rating;
      const totalRating = product.average_rating * product.total_reviews;
      const newAverageRating =
        (totalRating - oldRating + newRating) / product.total_reviews;

      review.rating = newRating;
      review.comment = newComment;
      await review.save();

      product.average_rating = newAverageRating.toFixed(1);
      await product.save();

      return {
        success: true,
        message: "Review updated in product model successfully!",
      };
    } catch (error) {
      console.error("Error updating review in product model:", error.message);
      throw new Error("Failed to update review in product model");
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createData,
  searchingItems,
  updateReview,
  RetrievingItems,
  categorySub,
  RetrieveById,
  UpdateProductById,
  DeleteProductById,
};
