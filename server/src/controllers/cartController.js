import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

// Helper to expand cart items with product details for the frontend
const populateCartItems = async (items) => {
  // We need to fetch product details for each item to match the redux state structure
  // The redux state expects:
  // { product: id, name, price, discountPrice, onSale, option, image, stock, quantity, subcategory, variant }

  // We'll populate the 'product' field
  // Note: we can't standard populate deeply into the array easily if we want to transform the output manually.
  // Let's iterate.

  const populatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue; // Skip if product deleted

    // logic from addItemToCart thunk in slice:
    const variant = item.variant;
    const isOnSale = product.on_sale;

    // Calculate price based on variant or sale
    // Note: This logic duplicates the frontend. Ideally we rely on the DB price,
    // but we must format it for the frontend.
    const price = variant
      ? variant.price
      : isOnSale
        ? product.discount_price || product.price
        : product.price;

    const stock = variant ? variant.quantity : product.quantity;

    populatedItems.push({
      product: product._id,
      name: product.product_name, // Schema uses product_name
      price: price,
      discountPrice: variant ? null : isOnSale ? null : product.discount_price,
      onSale: isOnSale,
      option: product.option,
      image: product.product_images,
      stock: stock,
      quantity: item.quantity,
      subcategory: product.subcategory,
      variant: variant || null,
    });
  }
  return populatedItems;
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    const formattedItems = await populateCartItems(cart.items);
    res.status(200).json({ items: formattedItems });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const syncCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body; // Expects simplified array: [{ product: id, quantity, variant }]

    // We can just overwrite the items
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      cart.items = items;
    }

    await cart.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Sync Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Merge guest cart with server cart on login
export const mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items: guestItems } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no server cart, just save the guest cart
      cart = new Cart({ userId, items: guestItems });
      await cart.save();
    } else {
      // Merge logic:
      // Loop through guest items. If item exists (same product + same variant), update quantity.
      // If not, push.

      guestItems.forEach((guestItem) => {
        const existingItemIndex = cart.items.findIndex((dbItem) => {
          const sameProduct = dbItem.product.toString() === guestItem.product;

          const guestVarId = guestItem.variant?._id;
          const dbVarId = dbItem.variant?._id;

          const sameVariant =
            (guestVarId && dbVarId && guestVarId === dbVarId) ||
            (!guestVarId && !dbVarId);

          return sameProduct && sameVariant;
        });

        if (existingItemIndex > -1) {
          // Update quantity
          cart.items[existingItemIndex].quantity += guestItem.quantity;
        } else {
          // Add new
          cart.items.push(guestItem);
        }
      });

      await cart.save();
    }

    // Return the full populated cart back to client
    const formattedItems = await populateCartItems(cart.items);
    res.status(200).json({ items: formattedItems });
  } catch (error) {
    console.error("Merge Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
