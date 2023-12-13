// Shadow Of Leaf was Here

const { Schema, model, ObjectId } = require("mongoose");

const subcategorieSchema = new Schema(
  {
    id: String,
    subcategory_name: {
      type: String,
      trim: true,
      maxlength: 25,
      required: true,
      unique: true,
    }, //this needs to be unique
    category_id: { type: ObjectId, ref: "Categories", required: true },
    active: { type: Boolean, default: false },
  },
  { collection: "SubCategories", versionKey: false }
);

const SubCategories = model("SubCategories", subcategorieSchema);
if (SubCategories) {
  console.log("SubCategory Schema created");
} else {
  console.log("error");
}
module.exports = SubCategories;
