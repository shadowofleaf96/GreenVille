const mongoose = require("mongoose");
const Joi = require("joi");

const vendorJoiSchema = Joi.object({
  customer: Joi.string().required(),
  store_name: Joi.string().required(),
  store_description: Joi.string().allow("", null).optional(),
  store_logo: Joi.string().allow("", null).optional(),
  phone_number: Joi.string().required(),
  vendor_type: Joi.string().valid("entrepreneur", "societe").required(),
  rc_number: Joi.string().required(),
  ice_number: Joi.string().required(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
  created_at: Joi.date().default(Date.now),
});

const vendorSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null, // Populated only after approval
    },
    store_name: {
      type: String,
      required: true,
      unique: true,
    },
    store_description: {
      type: String,
    },
    store_logo: {
      type: String,
    },
    phone_number: {
      type: String,
      required: true,
    },
    vendor_type: {
      type: String,
      enum: ["entrepreneur", "societe"],
      required: true,
    },
    rc_number: {
      type: String,
      required: true,
    },
    ice_number: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Vendors",
    versionKey: false,
  }
);

const Vendor = mongoose.model("Vendors", vendorSchema);

module.exports = { Vendor, vendorJoiSchema };
