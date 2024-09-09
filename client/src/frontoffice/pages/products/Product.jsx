import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";

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
    <div id="mainDiv" className="w-full p-4">
      <div className="p-4 rounded-2xl relative transition-all duration-500 border bg-gray-200 hover:shadow-lg">
        <Link to={`/product/${product?._id}`} className="block text-center">
          <div className="mb-4 transition-transform duration-500 transform hover:scale-105">
            <img
              className="w-48 h-48 mx-auto object-contain"
              src={`http://localhost:3000/${product?.product_image}`}
              alt={product?.product_name}
            />
          </div>
          <p className="h-16 mt-2 text-xl font-semibold hover:text-gray-500">{product?.product_name}</p>
        </Link>
        <div className="flex items-center justify-center mt-4">
          <div>
            {product?.discount_price && product?.discount_price !== product?.price ? (
              <div className="mb-4">
                <span className="font-bold text-xl mr-2 text-green-500">{product?.discount_price} DH</span>
                <span className="line-through text-xs text-gray-500">{product?.price} DH</span>
              </div>
            ) : (
              <span className="font-bold">{product?.price} DH</span>
            )}
          </div>
        </div>
        <button onClick={addToCart} className="bg-[#8DC63F] py-2 px-4 w-full flex justify-center items-center rounded-lg text-white">
          <Iconify icon="material-symbols-light:add-shopping-cart-rounded" height={36} width={36} />
          Add to Cart
        </button>
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
