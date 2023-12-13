import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../../redux/frontoffice/cartSlice";

import styles from "./Cart.module.scss";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Cart = ({ history }) => {
  const dispatch = useDispatch();

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
      <div className={styles.cart}>
        <div className="container mt-3">
          <div className="row g-3">
            <div className="col-md-8">
              <div className={styles.cart_container}>
                <div className="d-flex align-items-center justify-content-between">
                  <h4>Shopping Cart</h4>
                  <h4>{cartItems.length} items</h4>
                </div>
                <hr />
                <div>
                  {cartItems.map((item) => (
                    <Fragment key={item.product}>
                      <hr />
                      <div className={styles.cart_item} key={item.product}>
                        <div className={`row ${styles.item_info}`}>
                          <div className="col-4 col-lg-2">
                            <img
                              src={`http://localhost:3000/${item.image}`}
                              alt="Laptop"
                              height="100"
                              width="100"
                            />
                          </div>

                          <div className="col-5 col-lg-3">
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </div>

                          <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                            <span id="card_item_price">{item.price} DH</span>
                          </div>

                          {/* stock counter  */}
                          <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                            <div className={styles.stockCounter}>
                              <span
                                onClick={() =>
                                  decreaseQty(item.product, item.quantity)
                                }
                              >
                                -
                              </span>

                              <input
                                type="number"
                                value={item.quantity}
                                readOnly
                              />

                              <span
                                onClick={() =>
                                  increaseQty(
                                    item.product,
                                    item.quantity,
                                  )
                                }
                              >
                                +
                              </span>
                            </div>
                          </div>

                          <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                            <button
                              onClick={() =>
                                removeCartItemHandler(item.product)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-3 ms-auto">
              <div className={styles.order_summary}>
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:
                  <span className="ms-3">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0
                    )}{" "}
                    (Units or KG)
                  </span>
                </p>
                <p>
                  Total Price:
                  <span className="ms-3">
                    {cartItems
                      .reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}{" "}
                    DH
                  </span>
                </p>

                <hr />
                <div className="text-center">
                  <button onClick={checkoutHandler}>Check out</button>
                </div>
              </div>
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
              severity={
                typeof snackbarMessage === "string" &&
                snackbarMessage.includes("Error")
                  ? "error"
                  : "success"
              }
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Cart;
