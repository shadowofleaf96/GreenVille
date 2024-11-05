const Joi = require("joi");
const { Schema, model, Types } = require("mongoose");

const subcategoryJoiSchema = Joi.object({
  id: Joi.any().strip(),
  subcategory_name: Joi.string().trim().max(25).required(),
  category_id: Joi.string().required(),
  active: Joi.boolean().default(false),
});

const subcategorieSchema = new Schema(
  {
    id: {
      type: String,
    },
    subcategory_name: {
      type: String,
      trim: true,
      maxlength: 25,
      required: true,
      unique: true,
    },
    category_id: {
      type: Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "SubCategories",
    versionKey: false,
  }
);

subcategorieSchema.pre("save", async function (next) {
  try {
    await subcategoryJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const SubCategory = model("SubCategories", subcategorieSchema);
if (SubCategory) {
  console.log("SubCategory Schema created");
} else {
  console.log("error");
}

module.exports = {
  SubCategory,
};
