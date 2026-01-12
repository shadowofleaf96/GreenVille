import React, { useRef, useEffect, useState } from "react";
import Iconify from "../../../../backoffice/components/iconify";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import optimizeImage from "../../../components/optimizeImage";
import LazyImage from "../../../../components/lazyimage/LazyImage";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";

const FlashSales = ({ products }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();

  const [width, setWidth] = useState(0);
  const carouselRef = useRef();
  const innerRef = useRef();
  const controls = useAnimation();
  const x = useMotionValue(0);
  const isDragging = useRef(false);

  const flashSalesProducts = products?.filter(
    (product) => product.on_sale === true,
  );

  const noProductsAvailable = !products || products.length === 0;

  useEffect(() => {
    if (carouselRef.current && innerRef.current) {
      const totalWidth = innerRef.current.scrollWidth;
      const visibleWidth = carouselRef.current.offsetWidth;
      setWidth(totalWidth - visibleWidth);
    }
  }, [flashSalesProducts]);

  const handleScroll = (direction) => {
    const scrollAmount = 320;
    const currentX = x.get();

    let newX;
    if (direction === "left") {
      newX = Math.min(currentX + scrollAmount, 0);
    } else {
      if (Math.abs(currentX) >= width - 10) {
        newX = 0;
      } else {
        newX = Math.max(currentX - scrollAmount, -width);
      }
    }

    controls.start({
      x: newX,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  useEffect(() => {
    const intervalTime = 5000;

    const interval = setInterval(() => {
      if (isDragging.current) return;

      const currentX = x.get();
      let newX;

      if (Math.abs(currentX) >= width - 10) {
        newX = 0;
      } else {
        newX = Math.max(currentX - 320, -width);
      }

      controls.start({
        x: newX,
        transition: { duration: 0.8, ease: "easeInOut" },
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [width, controls, x]);

  return (
    <div className="relative mt-6 mb-6 mx-4 md:mx-0 select-none">
      <div className="container mx-auto px-4 mb-4 lg:mb-8">
        {noProductsAvailable ? (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <Iconify
              className="mb-2"
              icon="mdi:alert-circle-outline"
              width={100}
              height={100}
            />
            <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">
              {t("Error Loading Products")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t(
                "There was an issue loading the products. Please try again later.",
              )}
            </p>
            <Button
              className="px-6 p-3 bg-primary text-white shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-secondary rounded-md font-bold"
              onClick={() => navigate(0)}
            >
              {t("Reload")}
            </Button>
          </div>
        ) : (
          <>
            {flashSalesProducts?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                    {t("Flash Sales")}
                  </h4>
                  <Button
                    variant="premium"
                    className="h-10 px-6 text-xs sm:text-sm"
                    asChild
                  >
                    <Link to="/products/option?sales">
                      {t("See all")}
                      <Iconify
                        icon="solar:arrow-right-bold-duotone"
                        width={16}
                        className="ml-2 rtl:mr-2 rtl:rotate-180"
                      />
                    </Link>
                  </Button>
                </div>

                <div className="relative group">
                  <div className="max-w-full overflow-hidden" ref={carouselRef}>
                    <motion.div
                      className="flex space-x-4 mt-4 cursor-grab active:cursor-grabbing"
                      drag="x"
                      dragConstraints={{ right: 0, left: -width }}
                      animate={controls}
                      style={{ x }}
                      onDragStart={() => {
                        isDragging.current = true;
                      }}
                      onDragEnd={() => {
                        setTimeout(() => {
                          isDragging.current = false;
                        }, 200);
                      }}
                      ref={innerRef}
                      whileTap={{ cursor: "grabbing" }}
                    >
                      {flashSalesProducts.map((product, index) => (
                        <motion.div
                          key={index}
                          className="flex flex-col bg-white rounded-4xl w-64 md:w-80 shrink-0 overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 group/item"
                        >
                          <Link
                            to={`/product/${product?._id}`}
                            className="no-underline text-black font-semibold text-lg hover:text-gray-500"
                            draggable="false"
                            onClick={(e) => {
                              if (isDragging.current) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <div className="relative aspect-square bg-gray-50/50 p-6 flex items-center justify-center overflow-hidden">
                              <LazyImage
                                src={
                                  typeof product?.product_images === "string"
                                    ? `${optimizeImage(
                                        product?.product_images,
                                        400,
                                      )}`
                                    : `${optimizeImage(
                                        product?.product_images[0],
                                        400,
                                      )}`
                                }
                                alt={product?.product_name[currentLanguage]}
                                className="h-full w-full object-contain group-hover/item:scale-110 transition-transform duration-500 pointer-events-none drop-shadow-xl"
                                width={288}
                                height={208}
                              />
                            </div>
                            <div className="p-6 space-y-2 flex flex-col items-center">
                              <p className="text-gray-900 font-black text-sm md:text-base uppercase tracking-tight truncate px-2 text-center w-full">
                                {product?.product_name[currentLanguage]}
                              </p>
                              <div className="flex justify-center text-center">
                                {product?.discount_price &&
                                product?.discount_price !== product?.price ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-lg md:text-xl text-primary">
                                      {product?.discount_price} {t("DH")}
                                    </span>
                                    <span className="line-through text-xs md:text-sm text-gray-400 font-bold">
                                      {product?.price} {t("DH")}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-black text-lg md:text-xl text-gray-900">
                                    {product?.price} {t("DH")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  {/* Left Button */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-4 z-10">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleScroll("left")}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary text-white hover:bg-primary/90 opacity-75 hover:opacity-100 transition-all shadow-lg"
                    >
                      <Iconify
                        icon="material-symbols-light:chevron-left-rounded"
                        width={24}
                        className="sm:w-8 sm:h-8"
                      />
                    </Button>
                  </div>

                  {/* Right Button */}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-4 z-10">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleScroll("right")}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary text-white hover:bg-primary/90 opacity-75 hover:opacity-100 transition-all shadow-lg"
                    >
                      <Iconify
                        icon="material-symbols-light:chevron-right-rounded"
                        width={24}
                        className="sm:w-8 sm:h-8"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlashSales;
