import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Iconify from "../../../backoffice/components/iconify";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";
import { toast } from "react-toastify";

const backend = import.meta.env.VITE_BACKEND_URL;

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language

  const addToCart = () => {
    dispatch(addItemToCart({ id: product._id, quantity: 1 }));
    toast.success(t("itemAdded"));
  };

  const getImageSrc = () => {
    if (Array.isArray(product?.product_images)) {
      return `${product?.product_images[0]}`;
    } else if (typeof product?.product_images === "string") {
      return `${product?.product_images}`;
    } else {
      return "../../../../assets/image_placeholder.png";
    }
  };

  return (
    <div id="mainDiv" className="w-full p-2 sm:p-4">
      <div className="p-3 sm:p-4 rounded-lg sm:rounded-2xl relative transition-all duration-500 border bg-gray-200 hover:shadow-lg">
        <Link to={`/product/${product?._id}`} className="block text-center">
          <div className="mb-2 sm:mb-4 transition-transform duration-500 transform hover:scale-105">
            <img
              className="w-32 h-32 sm:w-48 sm:h-48 mx-auto object-contain"
              src={getImageSrc()}
              alt={product?.product_name[currentLanguage]}
            />
          </div>
          <p className="h-12 sm:h-16 mt-1 sm:mt-2 text-md sm:text-lg xl:text-xl font-semibold hover:text-gray-500 overflow-hidden whitespace-normal">
            {product?.product_name[currentLanguage]}
          </p>
        </Link>
        <div className="flex items-center justify-center mt-2 sm:mt-4">
          <div>
            {product?.discount_price && product?.discount_price !== product?.price ? (
              <div className="flex flex-col mb-2 sm:mb-4">
                <span className="font-bold text-sm sm:text-md xl:text-lg mr-2 text-center rtl:ml-2 text-green-500">
                  {product?.discount_price} {t("DH")}
                </span>
                <span className="line-through text-xs text-center lg:text-sm text-gray-500">
                  {product?.price} {t("DH")}
                </span>
              </div>
            ) : (
              <span className="font-bold text-lg sm:text-xl text-center">{product?.price} {t("DH")}</span>
            )}
          </div>
        </div>
        <button
          onClick={addToCart}
          className="bg-[#8DC63F] py-2 px-2 sm:px-4 w-full flex justify-center items-center rounded-lg text-white"
        >
          <Iconify
            icon="material-symbols-light:add-shopping-cart-rounded"
            height={24}
            width={24}
            className="mr-2"
          />
          <span className="text-sm sm:text-base">{t("addToCart")}</span>
        </button>
      </div>
    </div>
  );
};

export default Product;
