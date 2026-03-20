import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import Order from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { sendReviewNotificationEmail } from "../utils/emailUtility.js";
import { createDashboardNotification } from "../utils/dashboardNotificationUtility.js";
import { withTransaction } from "../utils/withTransaction.js";

export const createReview = async (req, res) => {
  const { product_id, customer_id, rating, comment, status } = req.body;

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

  try {
    const { savedReview, productData } = await withTransaction(
      async (session) => {
        const review = new Review({
          product_id,
          customer_id,
          rating,
          comment,
          status,
        });
        await review.save({ session });

        const product = await Product.findById(product_id).session(session);
        if (!product) {
          throw new Error("Product not found.");
        }

        const newTotalReviews = product.total_reviews + 1;
        const newAverageRating =
          (product.average_rating * product.total_reviews + rating) /
          newTotalReviews;

        product.total_reviews = newTotalReviews;
        product.average_rating = newAverageRating.toFixed(1);
        await product.save({ session });

        // Dashboard Notifications
        try {
          // Notify Admin
          await createDashboardNotification({
            type: "REVIEW_ADDED",
            title: "New Review Added",
            message: `A new ${rating}-star review was added for "${
              product.product_name?.en || "Product"
            }"`,
            metadata: { review_id: review._id, product_id: product._id },
            recipient_role: "admin",
            session,
          });

          // Notify Vendor
          if (product.vendor) {
            await createDashboardNotification({
              type: "REVIEW_ADDED",
              title: "New Product Review",
              message: `Your product "${
                product.product_name?.en || "Product"
              }" received a ${rating}-star review.`,
              metadata: { review_id: review._id, product_id: product._id },
              recipient_role: "vendor",
              vendor_id: product.vendor,
              session,
            });
          }
        } catch (notifError) {
          console.error(
            "Failed to create dashboard notifications:",
            notifError,
          );
          throw notifError;
        }

        return { savedReview: review, productData: product };
      },
    );

    // Send confirmation email to customer (outside transaction)
    const customer = await Customer.findById(customer_id);
    if (customer) {
      try {
        await sendReviewNotificationEmail(customer, productData, savedReview);
      } catch (emailError) {
        console.error("Failed to send review notification email:", emailError);
      }
    }

    res.status(201).json({
      message: "Review added successfully.",
      data: savedReview,
      product: {
        average_rating: productData.average_rating,
        total_reviews: productData.total_reviews,
      },
    });
  } catch (error) {
    console.error("Transaction Error during review save:", error);
    if (error.message === "Product not found.") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add review" });
  }
};

export const getProductReviews = async (req, res) => {
  const { id } = req.params;

  const reviews = await Review.find({
    product_id: id,
    status: "active",
  })
    .populate("customer_id", "first_name last_name customer_image")
    .lean();

  res.status(200).json({ data: reviews });
};

export const getAllReviews = async (req, res) => {
  const reviews = await Review.find()
    .populate("product_id", "product_name")
    .populate("customer_id", "first_name last_name")
    .lean();

  res.status(200).json({ data: reviews });
};

export const editReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment, status, review_date } = req.body;

  try {
    await withTransaction(async (session) => {
      const review = await Review.findById(id).session(session);
      if (!review) throw new Error("Review not found");

      const product = await Product.findById(review.product_id).session(
        session,
      );
      if (!product) throw new Error("Product not found");

      const oldRating = review.rating;
      const totalRating = product.average_rating * product.total_reviews;
      const newAverageRating =
        (totalRating - oldRating + rating) / product.total_reviews;

      review.rating = rating;
      review.comment = comment;
      review.status = status === "active" ? "active" : "inactive";
      review.review_date = review_date;

      await review.save({ session });

      product.average_rating = newAverageRating.toFixed(1);
      await product.save({ session });
    });
  } catch (error) {
    console.error("Transaction Error during review edit:", error);
    if (["Review not found", "Product not found"].includes(error.message)) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to edit review" });
  }

  const newReview = await Review.findById(id)
    .populate("product_id", "product_name")
    .populate("customer_id", "first_name last_name");

  res.status(200).json({
    data: newReview,
    success: true,
    message: "Review and product rating updated successfully!",
  });
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await withTransaction(async (session) => {
      const review = await Review.findById(id).session(session);
      if (!review) throw new Error("Review not found");

      const product = await Product.findById(review.product_id).session(
        session,
      );
      if (!product) throw new Error("Product not found");

      const totalReviews = product.total_reviews - 1;
      let newAverageRating = 0;

      if (totalReviews > 0) {
        const totalRating = product.average_rating * product.total_reviews;
        newAverageRating = (totalRating - review.rating) / totalReviews;
      }

      product.total_reviews = totalReviews;
      product.average_rating = newAverageRating.toFixed(1);
      await product.save({ session });

      await review.deleteOne({ session });
    });
  } catch (error) {
    console.error("Transaction Error during review deletion:", error);
    if (["Review not found", "Product not found"].includes(error.message)) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to delete review" });
  }

  res.status(200).json({
    success: true,
    message: "Review deleted and product rating updated successfully!",
  });
};
