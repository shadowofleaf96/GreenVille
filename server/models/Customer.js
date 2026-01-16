const Joi = require("joi");
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const customerJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  customer_image: Joi.string().allow(null, "").optional(),
  first_name: Joi.string().trim().max(25).required(),
  last_name: Joi.string().trim().max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  shipping_address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postal_code: Joi.string().required(),
    phone_no: Joi.string().required(),
    country: Joi.string().optional(),
    latitude: Joi.number().optional().allow(null),
    longitude: Joi.number().optional().allow(null),
  }).optional(),
  creation_date: Joi.number(),
  last_login: Joi.number(),
  resetPasswordExpires: Joi.date(),
  resetPasswordToken: Joi.string(),
  validation_token: Joi.string().allow(null),
  status: Joi.boolean(),
});

const customerSchema = new Schema(
  {
    customer_image: {
      type: String,
    },
    first_name: {
      type: String,
      trim: true,
      maxlength: 25,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      maxlength: 25,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    creation_date: {
      type: Number,
      default: Date.now,
    },
    last_login: {
      type: Number,
      default: Date.now,
    },
    resetPasswordExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    validation_token: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    shipping_address: {
      street: String,
      city: String,
      phone_no: String,
      postal_code: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
  },
  { collection: "Customers", versionKey: false }
);

customerSchema.pre("save", async function () {
  try {
    await customerJoiSchema.validateAsync(this.toObject());
  } catch (error) {
    console.error(error);
  }
});

customerSchema.methods.validatePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const Customer = model("Customers", customerSchema);
if (Customer) {
  console.log("Customer Schema created");
} else {
  console.log("error");
}

module.exports = {
  Customer,
};
