import { memo } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";
import { addItemToCart } from "@/store/slices/shop/cartSlice";
import { toast } from "react-toastify";
import optimizeImage from "../optimizeImage";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { Button } from "@/components/ui/button";

const Product = memo(({ product, onQuickView }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const addToCart = (e) => {
    e.preventDefault();
    dispatch(addItemToCart({ id: product._id, quantity: 1, product }));
    toast.success(t("itemAdded"));
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    onQuickView(product);
  };

  const getImageSrc = () => {
    if (Array.isArray(product?.product_images)) {
      return `${optimizeImage(product?.product_images[0], 400)}`;
    } else if (typeof product?.product_images === "string") {
      return `${optimizeImage(product?.product_images, 400)}`;
    } else {
      return "/assets/image_placeholder.png";
    }
  };

  const getDisplayPrice = () => {
    if (product?.variants && product.variants.length > 0) {
      const minPrice = Math.min(...product.variants.map((v) => v.price));
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-0.5">
            {t("Starting From")}
          </span>
          <span className="font-black text-lg text-primary tracking-tight">
            {minPrice} {t("DH")}
          </span>
        </div>
      );
    }
    if (product?.on_sale && product?.discount_price) {
      return (
        <div className="flex flex-col items-center">
          <span className="font-black text-lg text-primary tracking-tight">
            {product?.discount_price} {t("DH")}
          </span>
          <span className="line-through text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {product?.price} {t("DH")}
          </span>
        </div>
      );
    }
    return (
      <span className="font-black text-lg text-gray-900 tracking-tight">
        {product?.price} {t("DH")}
      </span>
    );
  };

  return (
    <div
      data-testid="product-card"
      className="group relative bg-white rounded-4xl border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full overflow-hidden"
    >
      {/* Product Link Content */}
      <Link
        href={`/product/${product?._id}`}
        className="p-4 sm:p-6 grow flex flex-col"
      >
        {/* Badge (Sale or New - optional enhancement) */}
        {product?.on_sale && product?.discount_price && (
          <div className="absolute top-4 left-4 z-40">
            <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
              {t("Sale")}
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="mb-6 relative transition-transform duration-700 ease-out group-hover:scale-105 h-40 sm:h-52 aspect-square mx-auto flex items-center justify-center">
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />

          <LazyImage
            wrapperClassName="w-full h-full flex items-center justify-center relative z-10"
            className="max-w-full max-h-full object-contain drop-shadow-xl"
            src={getImageSrc()}
            alt={product?.product_name[currentLanguage]}
            width={200}
            height={200}
          />
        </div>

        {/* Product Name */}
        <h3 className="h-12 text-sm sm:text-base font-black text-gray-900 group-hover:text-primary transition-colors overflow-hidden line-clamp-2 px-1 text-center leading-snug">
          {product?.product_name[currentLanguage]}
        </h3>

        {/* Vendor name */}
        <div className="h-6 mt-2 flex justify-center">
          {product?.vendor && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
              {t("Sold by")}:{" "}
              <span className="text-primary font-black">
                {product.vendor.store_name}
              </span>
            </p>
          )}
        </div>

        {/* Price section */}
        <div className="flex items-center justify-center mt-4 h-12">
          {getDisplayPrice()}
        </div>
      </Link>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={product?.variants?.length > 0 ? handleQuickView : addToCart}
          className="w-full h-12 rounded-2xl bg-gray-900 group-hover:bg-primary text-white font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-gray-200 group-hover:shadow-primary/30 transition-all duration-500 flex items-center justify-center gap-2 border-none"
        >
          <Iconify
            icon={
              product?.variants?.length > 0
                ? "solar:eye-bold-duotone"
                : "solar:cart-large-minimalistic-bold-duotone"
            }
            width={20}
          />
          {product?.variants?.length > 0 ? t("Select Options") : t("addToCart")}
        </Button>
      </div>
    </div>
  );
});

export default Product;
