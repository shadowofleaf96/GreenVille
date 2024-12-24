const mongoose = require("mongoose");
const Joi = require("joi");

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    review_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    collection: "Reviews",
    versionKey: false,
  }
);

const validateReview = (review) => {
  const schema = Joi.object({
    product_id: Joi.string().required().objectId(),
    customer_id: Joi.string().required().objectId(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow("").optional().max(500),
  });

  return schema.validate(review);
};

const Review = mongoose.model("Review", reviewSchema);

Review.validateReview = validateReview;

module.exports = Review;
