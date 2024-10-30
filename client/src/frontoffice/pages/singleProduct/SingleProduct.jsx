import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails, clearErrors } from "../../../redux/frontoffice/productSlice";
import Loader from "../../components/loader/Loader";
import Iconify from "../../../backoffice/components/iconify";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";
import MetaData from "../../components/MetaData";
import { useTranslation } from 'react-i18next';

const backend = import.meta.env.VITE_BACKEND_URL;

const SingleProduct = () => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, product } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.product_images && product?.product_images.length > 0) {
      setSelectedImage(`${backend}/${product.product_images[0]}`);
    }
  }, [product?.product_images]);

  const increaseQty = () => {
    if (quantity >= product.quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addToCart = () => {
    dispatch(addItemToCart({ id: product._id, quantity }));
  };

  const buyNow = () => {
    dispatch(addItemToCart({ id: product._id, quantity }));
    navigate("/cart");
  };

  return (
    <Fragment>
      <MetaData title={t("product_details")} />
      <div className="w-full h-auto flex flex-col items-center justify-center p-8 my-6">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-5xl">
            {product ? (
              <>
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                  {selectedImage && (
                    <div className="w-full max-w-sm rounded-lg shadow-lg overflow-hidden mb-6">
                      <img
                        src={selectedImage}
                        alt={t("selected_product")}
                        className="object-contain w-full h-[380px] sm:h-[200px]"
                      />
                    </div>
                  )}

                  <div className="flex overflow-x-auto space-x-4">
                    {Array.isArray(product?.product_images) ? (
                      product.product_images.map((image, index) => (
                        <img
                          key={index}
                          src={`${backend}/${image}`}
                          alt={`${t("product_image")} ${index + 1}`}
                          className="w-14 h-14 object-contain cursor-pointer border-2 border-gray-300 rounded-lg hover:border-green-500"
                          onClick={() => setSelectedImage(`${backend}/${image}`)}
                        />
                      ))
                    ) : (
                      <img
                        src={`${backend}/${product.product_images}`}
                        alt={t("main_product")}
                        className="w-14 h-14 object-contain cursor-pointer border-2 shadow-lg border-gray-300 rounded-lg hover:border-green-500"
                        onClick={() => setSelectedImage(`${backend}/${product.product_images}`)}
                      />
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col space-y-4 p-4">
                  <div className="product_description">
                    <h4 className="text-3xl font-bold mb-4">{product.product_name}</h4>
                    <h2 className="text-2xl font-bold mb-4 text-green-600">
                      {product.discount_price} {t("currency")}{" "}
                      <strike className="text-sm font-medium text-gray-400">
                        {product.price} {t("currency")}
                      </strike>
                    </h2>
                    <p className="text-gray-600 my-4 h-auto min-h-16">{product.short_description}</p>
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
                    <span className={`ml-2 font-bold ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                      {product.quantity > 0 ? t("in_stock") : t("out_of_stock")}
                    </span>
                  </p>
                  <div className="flex space-x-4 mt-4 rtl:gap-4">
                    <button
                      className="bg-[#8DC63F] flex gap-2 text-white py-3 px-6 font-medium rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                      disabled={product.quantity === 0}
                      onClick={buyNow}
                    >
                      {t("buy_now")}
                      <Iconify icon="material-symbols:sell-outline" height={22} width={22} />
                    </button>
                    <button
                      className="bg-white flex gap-2 text-grey-800 border-[#8DC63F] border-2 py-3 px-6 font-medium rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                      disabled={product.quantity === 0}
                      onClick={addToCart}
                    >
                      {t("add_to_cart")}
                      <Iconify icon="mdi-light:cart" height={22} width={22} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p>{t("error_loading_product")}</p>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default SingleProduct;
