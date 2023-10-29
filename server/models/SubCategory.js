// Shadow Of Leaf was Here

const {Schema, model, ObjectId} = require("mongoose");

const subcategorieSchema = new Schema({
  id: String,
  subcategory_name: {type: String, trim:true, maxlength:25, require:true},
  category_id: {type: ObjectId, ref: 'Categories', require:true},
  active: {type: Boolean},
 
}, { collection: "SubCategories" });

const SubCategories = model('SubCategories', subcategorieSchema);
if (SubCategories) {
  console.log("SubCategory Schema created");
} else {
  console.log("error");
}
module.exports = SubCategories;
