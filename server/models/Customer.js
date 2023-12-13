// Shadow Of Leaf was Here

const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = new Schema(
  {
    id: String,
    customer_image: String,
    first_name: { type: String, trim: true, maxlength: 25, required: true },
    last_name: { type: String, trim: true, maxlength: 25, required: true },
    email: { type: String, trim: true, maxlength: 25, required: true },
    password: { type: String, required: true },
    creation_date: { type: Number, default: Date.now },
    last_login: { type: Number, default: Date.now },
    valid_account: Boolean,
    resetPasswordExpires: {type:Date},
    resetPasswordToken: {type:String},
    active: Boolean,
  },
  { collection: "Customers", versionKey: false }
);

// Define the validatePassword method for user model
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
