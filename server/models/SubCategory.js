const {Schema, model, ObjectId} = require("mongoose");

const subcategorieSchema = new Schema({
  id: String,
  subcategory_name: {type: String, trim:true, maxlength:25, require:true},
  category_id: {type: ObjectId, ref: 'Categories', require:true},
  active: {type: Boolean},
 
}, { collection: "SubCategories" });

const SubCategories = model('SubCategories', subcategorieSchema);
module.exports = SubCategories;
