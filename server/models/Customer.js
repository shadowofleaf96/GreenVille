const Joi = require("joi");
const { Schema, model, Types } = require("mongoose");

const customerJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  customer_image: Joi.string().allow(null, '').optional(),
  first_name: Joi.string().trim().max(25).required(),
  last_name: Joi.string().trim().max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  creation_date: Joi.number(),
  last_login: Joi.number(),
  resetPasswordExpires: Joi.date(),
  resetPasswordToken: Joi.string(),
  validation_token: Joi.string().allow(null),
  active: Joi.boolean(),
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
    active: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Customers", versionKey: false }
);

customerSchema.pre("save", async function (next) {
  try {
    await customerJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
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
