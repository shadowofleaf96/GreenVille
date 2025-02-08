const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const notificationSchema = new mongoose.Schema({
  subject: String,
  body: String,
  sendType: { type: String, enum: ['email', 'android'] },
  recipients: [String],
  dateSent: { type: Date, default: Date.now }
});

const subcategorieSchema = new Schema(
  {
    subcategory_name: {
      en: { type: String, trim: true, maxlength: 25, required: true },
      fr: { type: String, trim: true, maxlength: 25, required: true },
      ar: { type: String, trim: true, maxlength: 25, required: true },
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
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
    await notificationSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const SubCategory = model("SubCategories", subcategorieSchema);

if (SubCategory) {
  console.log("SubCategory Schema created");
} else {
  console.log("Error creating SubCategory model");
}

module.exports = {
  SubCategory,
};
