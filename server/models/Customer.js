const { Schema, model } = require("mongoose");

const customerSchema = new Schema({
  id: String,
  first_name: { type: String, trim: true, maxlength: 25, require: true },
  last_name: { type: String, trim: true, maxlength: 25, require: true },
  email: { type: String, trim: true, maxlength: 25, require: true },
  password: { type: String, require: true },
  creation_date: { type: Number, default: Date.now },
  last_login: { type: Number, default: Date.now },
  valid_account: Boolean,
  active: Boolean,
}, { collection: "Customers" });



const Customers = model('Customers', customerSchema);
module.exports = Customers;