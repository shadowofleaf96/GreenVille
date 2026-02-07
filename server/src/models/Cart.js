import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  // Storing the variant object or ID.
  // Since the frontend uses the full variant object, we'll store it as Mixed
  // to preserve flexibility, or we could strict type it if we knew the schema perfectly.
  // Given existing project structure, Mixed is safer for now to avoid data loss on sync.
  variant: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Cart = mongoose.model("Cart", CartSchema);
