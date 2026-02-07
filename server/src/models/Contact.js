import Joi from "joi";
import mongoose from "mongoose";

const contactJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  name: Joi.string(),
  email: Joi.string().required(),
  phone_number: Joi.string().required(),
  message: Joi.string().required(),
});

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Contact",
    versionKey: false,
  },
);

contactSchema.pre("save", async function () {
  try {
    const validatedData = await contactJoiSchema.validateAsync(this.toObject());

    this.name = validatedData.name;
    this.email = validatedData.email;
    this.phone_number = validatedData.phone_number;
    this.message = validatedData.message;
  } catch (error) {
    console.error(error);
  }
});

export const Contacts = mongoose.model("Contacts", contactSchema);
if (Contacts) {
  console.log("Contacts Schema created");
} else {
  console.log("error");
}
