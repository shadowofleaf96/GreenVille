import mongoose from "mongoose";
import Joi from "joi";

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
  },
);

export const validateReview = (review) => {
  const schema = Joi.object({
    product_id: Joi.string().required(),
    customer_id: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow("").optional().max(500),
  });

  return schema.validate(review);
};

export const Review = mongoose.model("Review", reviewSchema);
