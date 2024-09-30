import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetails, clearErrors } from "../../../redux/frontoffice/productSlice";
import Loader from "../../components/loader/Loader";
import Iconify from "../../../backoffice/components/iconify";
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
      <div className="w-full h-auto flex flex-col items-center justify-center p-8 my-6">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-5xl">
            {product ? (
              <>
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                  {product?.product_image && (
                    <>
                      <div className="w-full max-w-sm rounded-lg shadow-lg overflow-hidden mb-6">
                        <img
                          src={`http://localhost:3000/${product?.product_image}`}
                          alt={product.product_image}
                          className="object-contain w-full h-[380px] sm:h-[200px]"
                        />
                      </div>
                      <div className="flex overflow-x-auto space-x-4">
                        {/* Render product images dynamically */}
                      </div>
                    </>
                  )}
                </div>

                <div className="w-full lg:w-1/2 flex flex-col space-y-4 p-4">
                  <div className="product_description">
                    <h4 className="text-3xl font-bold mb-4">{product.product_name}</h4>
                    <h2 className="text-2xl font-bold mb-4 text-green-600">
                      {product.discount_price} DH{" "}
                      <strike className="text-sm font-medium text-gray-400">
                        {product.price} DH
                      </strike>
                    </h2>
                    <p className="text-gray-600 mb-4">{product.long_description}</p>
                  </div>

                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      className="border p-2 rounded-full hover:bg-red-500 hover:text-white"
                      onClick={decreaseQty}
                    >
                      <Iconify icon="material-symbols-light:remove" width={16} height={16} />
                    </button>
                    <input
                      className="w-12 text-center p-2 bg-white rounded-lg border-2 border-green-400"
                      type="number"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="border p-2 rounded-full hover:bg-green-500 hover:text-white"
                      onClick={increaseQty}
                    >
                      <Iconify icon="material-symbols-light:add" width={16} height={16} />
                    </button>
                  </div>

                  <p className="mt-4">
                    <span
                      className={`ml-2 font-bold ${product.quantity > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-[#8DC63F] text-white py-3 px-6 font-medium rounded-lg hover:bg-green-600 transition duration-300"
                      disabled={product.quantity === 0}
                      onClick={addToCart}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </>
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
                severity={snackbarMessage.includes("Error") ? "error" : "success"}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default SingleProduct;
