import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProductDetails,
  clearErrors,
} from "../../../redux/frontoffice/productSlice";
import Loader from "../../components/loader/Loader";
import Iconify from "../../../backoffice/components/iconify";
import styles from "./SingleProduct.module.scss";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const SingleProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, product } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);

  const increaseQty = () => {
    if (quantity >= product.quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const addToCart = () => {
    dispatch(addItemToCart({ id: product._id, quantity: quantity }));
    openSnackbar("Item Added to Cart");
  };

  return (
    <Fragment>
      <MetaData title={"Product Details"} />
      <Navbar />
      <div className={styles.product_details}>
        {loading ? (
          <Loader />
        ) : (
          <div className="container mb-5">
            {product ? (
              <div className="row g-3">
                <div className="col-md-6">
                  {product?.product_image && (
                    <>
                      <div className={styles.preview_image}>
                        <img
                          src={`http://localhost:3000/${product?.product_image}`}
                          alt={product.product_image}
                        />
                      </div>
                      <div className={styles.products_container}></div>
                    </>
                  )}
                </div>
                <div className="col-md-6">
                  <div className={styles.Product_info}>
                    <div className="product_description">
                      <h4>{product.product_name}</h4>
                      <p>{product.long_description}</p>
                      <h2 className="mb-3">{product.discount_price} DH</h2>
                    </div>
                    <div className={styles.stock_counter}>
                      <span className="minus" onClick={decreaseQty}>
                        <Iconify
                          icon="material-symbols-light:remove"
                          width={16}
                          height={16}
                        />
                      </span>
                      <input
                        className="count"
                        type="number"
                        value={quantity}
                        readOnly
                      />
                      <span className="plus" onClick={increaseQty}>
                        <Iconify
                          icon="material-symbols-light:add"
                          width={16}
                          height={16}
                        />
                      </span>
                    </div>
                    <p className="mt-3">
                      Status:
                      <span
                        id="stock_status"
                        className={
                          product.quantity > 0
                            ? "greenColor ms-2"
                            : "redColor ms-2"
                        }
                      >
                        <b>
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </b>
                      </span>
                    </p>
                    <p className="mt-3">
                      Quantity: <strong>{product.quantity}</strong>
                    </p>
                    <div className={styles.button}>
                      <button
                        disabled={product.quantity === 0}
                        onClick={addToCart}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Error loading product details.</p>
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={closeSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Alert
                onClose={closeSnackbar}
                severity={
                  snackbarMessage.includes("Error") ? "error" : "success"
                }
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </div>
        )}
      </div>
      <Footer />
    </Fragment>
  );
};

export default SingleProduct;