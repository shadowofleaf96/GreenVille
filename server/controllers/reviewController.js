const Review = require("../models/Review");
const { Product } = require("../models/Product");
const Order = require("../models/Order");

exports.createReview = async (req, res) => {
  const { product_id, customer_id, rating, comment, status } = req.body;

  try {
    const order = await Order.findOne({
      customer_id,
      "order_items.product_id": product_id,
    });

    if (!order) {
      return res
        .status(400)
        .json({ error: "You have not purchased this product." });
    }

    const existingReview = await Review.findOne({ product_id, customer_id });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this product." });
    }

    const review = new Review({
      product_id,
      customer_id,
      rating,
      comment,
      status,
    });
    await review.save();

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const newTotalReviews = product.total_reviews + 1;
    const newAverageRating =
      (product.average_rating * product.total_reviews + rating) /
      newTotalReviews;

    product.total_reviews = newTotalReviews;
    product.average_rating = newAverageRating.toFixed(1);
    await product.save();

    await Order.updateOne(
      { _id: order._id, "order_items.product_id": product_id },
      { $set: { "order_items.$.reviewed": true } }
    );

    res.status(201).json({
      message: "Review added successfully.",
      data: review,
      product: {
        average_rating: product.average_rating,
        total_reviews: product.total_reviews,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getProductReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({
      product_id: id,
      status: "active",
    }).populate("customer_id", "first_name last_name customer_image");

    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." + error });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product_id", "product_name")
      .populate("customer_id", "first_name last_name")
      .lean();

    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." + error });
  }
};

exports.editReview = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Request Body:", req.body); // Debug incoming data
    const { rating, comment, status, review_date } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const product = await Product.findById(review.product_id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const oldRating = review.rating;
    const totalRating = product.average_rating * product.total_reviews;
    const newAverageRating =
      (totalRating - oldRating + rating) / product.total_reviews;

    review.rating = rating;
    review.comment = comment;
    review.status = status === "active" ? "active" : "inactive";
    review.review_date = review_date;

    await review.save();

    product.average_rating = newAverageRating.toFixed(1);
    await product.save();

    const newReview = await Review.findById(id)
      .populate("product_id", "product_name")
      .populate("customer_id", "first_name last_name");

    res.status(200).json({
      data: newReview,
      success: true,
      message: "Review and product rating updated successfully!",
    });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ error: "Failed to update review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const product = await Product.findById(review.product);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const totalReviews = product.total_reviews - 1;
    let newAverageRating = 0;

    if (totalReviews > 0) {
      const totalRating = product.average_rating * product.total_reviews;
      newAverageRating = (totalRating - review.rating) / totalReviews;
    }

    product.total_reviews = totalReviews;
    product.average_rating = newAverageRating.toFixed(1);
    await product.save();

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted and product rating updated successfully!",
    });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
};
