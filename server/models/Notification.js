const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    sendType: {
      type: String,
      enum: ["email", "android", "both"],
      required: true,
    },
    recipients: {
      type: [String],
      required: true,
    },
    dateSent: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Notifications",
    versionKey: false,
  }
);

const notificationValidationSchema = Joi.object({
  _id: Joi.any().strip(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  sendType: Joi.string().valid("email", "android", "both").required(),
  recipients: Joi.array().items(Joi.string()).required(),
  dateSent: Joi.date().default(Date.now),
});

notificationSchema.pre("save", async function (next) {
  try {
    await notificationValidationSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

if (Notification) {
  console.log("Notification Schema created");
} else {
  console.log("Error creating Notification Schema");
}

module.exports = Notification;
