import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Iconify from "../../../backoffice/components/iconify";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../../redux/frontoffice/cartSlice";

import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Cart = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { cartItems } = useSelector((state) => state.carts);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
    openSnackbar("Item Removed Successfully");
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) return;
    dispatch(addItemToCart({ id, quantity: newQty }));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    dispatch(addItemToCart({ id, quantity: newQty }));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Fragment>
      <MetaData title={"Cart"} />
      <Navbar />
      <div className="min-h-screen flex flex-col mt-8 px-4">
        <div className="container mx-auto grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="p-4 bg-white shadow rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold">Shopping Cart</h4>
                <h4 className="text-lg">{cartItems.length} items</h4>
              </div>
              <hr />
              <div className="container mx-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <Iconify icon="mdi:shopping" width={24} height={24} />
                    <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                      to="/products"
                      className="bg-[#8DC63F] text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition duration-300"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <Fragment key={item.product}>
                      <div className="flex items-center gap-4 my-4">
                        <img
                          src={`http://localhost:3000/${item.image}`}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <Link to={`/product/${item.product}`} className="text-blue-500 hover:underline">
                            {item.name}
                          </Link>
                          <p className="text-green-400 font-semibold text-lg mt-2">{item.price} DH</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.product, item.quantity)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-red-500 hover:text-white"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center rounded-lg bg-white border border-green-400"
                          />
                          <button
                            onClick={() => increaseQty(item.product, item.quantity, item.stock)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-green-500 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeCartItemHandler(item.product)}
                          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <hr />
                    </Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="order_summary p-4 bg-white shadow rounded-lg">
            <h4 className="text-lg font-bold mb-4">Order Summary</h4>
            <hr />
            <p className="flex justify-between my-2">
              <span>Subtotal</span>
              <span>{cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)} (Units or KG)</span>
            </p>
            <p className="flex justify-between my-2">
              <span>Total Price</span>
              <span>{cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)} DH</span>
            </p>
            <hr />
            {cartItems.length != 0 ? (
              <div className="text-center mt-4">
                <button onClick={checkoutHandler} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                  Checkout
                </button>
              </div>) : (<div className="text-center mt-4">
                <button disabled onClick={checkoutHandler} className="bg-gray-100 text-gray-400 py-2 px-4 rounded-md">
                  Checkout
                </button>
              </div>)}
          </div>
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbarMessage.includes("Error") ? "error" : "success"}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Cart;
