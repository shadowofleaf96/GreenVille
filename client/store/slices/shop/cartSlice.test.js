import { describe, it, expect } from "vitest";
import reducer, {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart,
} from "./cartSlice";

describe("cartSlice reducer", () => {
  const initialState = {
    cartItems: [],
    cartCount: 0,
    shippingInfo: {},
    coupon: null,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle removeItemFromCart", () => {
    const stateWithItems = {
      ...initialState,
      cartItems: [
        { product: "1", quantity: 1, variant: { _id: "v1" } },
        { product: "2", quantity: 2, variant: null },
      ],
      cartCount: 3,
    };

    // Remove item with variant
    const nextState = reducer(
      stateWithItems,
      removeItemFromCart({ productId: "1", variantId: "v1" }),
    );
    expect(nextState.cartItems).toHaveLength(1);
    expect(nextState.cartItems[0].product).toBe("2");
    expect(nextState.cartCount).toBe(2);

    // Remove item without variant
    const nextState2 = reducer(
      stateWithItems,
      removeItemFromCart({ productId: "2" }),
    );
    expect(nextState2.cartItems).toHaveLength(1);
    expect(nextState2.cartItems[0].product).toBe("1");
    expect(nextState2.cartCount).toBe(1);
  });

  it("should handle updateCartItemQuantity", () => {
    const stateWithItem = {
      ...initialState,
      cartItems: [{ product: "1", quantity: 1, variant: null }],
      cartCount: 1,
    };
    const nextState = reducer(
      stateWithItem,
      updateCartItemQuantity({ productId: "1", quantity: 5 }),
    );
    expect(nextState.cartItems[0].quantity).toBe(5);
    expect(nextState.cartCount).toBe(5);
  });

  it("should handle clearCart", () => {
    const dirtyState = {
      cartItems: [{ product: "1", quantity: 1 }],
      cartCount: 1,
      shippingInfo: { address: "test" },
      coupon: "DISCOUNT10",
    };
    expect(reducer(dirtyState, clearCart())).toEqual(initialState);
  });

  describe("addItemToCart extraReducer", () => {
    it("should add a new item to the cart", () => {
      const newItem = {
        product: "1",
        quantity: 1,
        variant: null,
        name: "Product 1",
      };
      const nextState = reducer(initialState, {
        type: addItemToCart.fulfilled.type,
        payload: newItem,
      });
      expect(nextState.cartItems).toHaveLength(1);
      expect(nextState.cartItems[0]).toEqual(newItem);
      expect(nextState.cartCount).toBe(1);
    });

    it("should increment quantity if item already exists", () => {
      const existingItem = { product: "1", quantity: 1, variant: null };
      const initialStateWithItem = {
        ...initialState,
        cartItems: [existingItem],
        cartCount: 1,
      };
      const newItem = { product: "1", quantity: 2, variant: null };
      const nextState = reducer(initialStateWithItem, {
        type: addItemToCart.fulfilled.type,
        payload: newItem,
      });
      expect(nextState.cartItems).toHaveLength(1);
      expect(nextState.cartItems[0].quantity).toBe(3);
      expect(nextState.cartCount).toBe(3);
    });
  });
});
