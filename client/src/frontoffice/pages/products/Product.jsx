import { React, useState } from "react";
import { useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";

import styles from "./Products.module.scss";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };
  const addToCart = () => {
    dispatch(addItemToCart({ id: product._id, quantity: 1 }));
    openSnackbar("Item Added to Cart");
  };

  return (
    <div className="col-md-4">
      <div className={styles.product}>
        <Link to={`/product/${product?._id}`}>
          <div className={styles.product_image}>
            <img
              src={`http://localhost:3000/${product?.product_image}`}
              alt={product?.product_name}
            />
          </div>
          <p className={styles.product_name}>{product?.product_name}</p>
        </Link>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            {product?.discount_price &&
            product?.discount_price !== product?.price ? (
              <div>
                <span className="text-decoration-line-through me-2">
                  {product?.price}DH
                </span>
                <span className="fw-bold">{product?.discount_price} DH</span>
              </div>
            ) : (
              <span className="fw-bold">{product?.price}DH</span>
            )}
          </div>
        </div>
        <div className={styles.link_container}>
          <button onClick={addToCart}>
            <Iconify
              icon="material-symbols-light:add-shopping-cart-rounded"
              height={36}
              width={36}
            />
          </button>
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
  );
};

export default Product;
