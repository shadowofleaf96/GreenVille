// Shadow Of Leaf was here
const Joi = require("joi");
const bcrypt = require("bcrypt");
require('dotenv').config({ path: '../.env' });
const mongoose = require("mongoose");

const userJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  user_image: Joi.string().allow(null, "").optional(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required(),
  user_name: Joi.string().required(),
  password: Joi.string().required(),
  creation_date: Joi.number(),
  last_login: Joi.number(),
  last_update: Joi.number(),
  status: Joi.boolean(),
  resetPasswordToken:Joi.string(),
  resetPasswordExpires:Joi.date()
});

const userSchema = new mongoose.Schema(
  {
    user_image: {
      type: String,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
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
    },
    last_update: {
      type: Number,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    collection: "Users",
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
    }

    const validatedData = await userJoiSchema.validateAsync(this.toObject());

    this.user_image = validatedData.user_image;
    this.first_name = validatedData.first_name;
    this.last_name = validatedData.last_name;
    this.email = validatedData.email;
    this.role = validatedData.role;
    this.user_name = validatedData.user_name;
    this.creation_date = validatedData.creation_date;
    this.last_login = validatedData.last_login;
    this.last_update = validatedData.last_update;
    this.status = validatedData.status;
    this.resetPasswordToken = validatedData.resetPasswordToken;
    this.resetPasswordExpires = validatedData.resetPasswordExpires;
  
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.validatePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("Users", userSchema);
if (User) {
  console.log("User Schema created");
} else {
  console.log("error");
}

module.exports = {
  User,
};
