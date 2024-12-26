import React, { useRef, useEffect } from "react";
import Iconify from "../../../../backoffice/components/iconify";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FlashSales = ({ products }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction, ref, itemWidth) => {
    const { current } = ref;
    if (current) {
      const scrollLeft = current.scrollLeft;

      if (direction === "left") {
        current.scrollBy({ left: -itemWidth, behavior: "smooth" });
      } else if (direction === "right") {
        const scrollWidth = current.scrollWidth;
        const clientWidth = current.clientWidth;

        if (scrollLeft + clientWidth >= scrollWidth) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          current.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    const intervalTime = 3500;
    const itemWidth = 300;

    const interval = setInterval(() => {
      const { current } = scrollRef;
      if (current) {
        const scrollWidth = current.scrollWidth;
        const clientWidth = current.clientWidth;
        const scrollLeft = current.scrollLeft;

        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          current.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  const flashSalesProducts = products?.filter((product) =>
    product.option.includes("Flash Sales")
  );

  const noProductsAvailable = !products || products.length === 0;

  return (
    <div className="relative mt-6 mb-6 mx-4 md:mx-0 select-none">
      <div className="container mx-auto px-4 mb-4 lg:mb-8">
        {noProductsAvailable ? (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <Iconify className="mb-2" icon="mdi:alert-circle-outline" width={100} height={100} />
            <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">
              {t("Error Loading Products")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("There was an issue loading the products. Please try again later.")}
            </p>
            <button
              className="px-6 p-3 bg-[#8DC63F] text-white shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg rounded-md hover:shadow-yellow-400"
              onClick={() => navigate(0)}
            >
              {t("Reload")}
            </button>
          </div>
        ) : (
          <>
            {flashSalesProducts?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">{t("Flash Sales")}</h4>
                  <span className="bg-[#8DC63F] text-white px-4 py-2 rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
                    <Link
                      to="/products/option?sales"
                      className="no-underline font-medium transition-colors duration-300 hover:text-gray-300"
                    >
                      {t("See all")}
                    </Link>
                  </span>
                </div>
                <div className="relative max-w-full overflow-hidden">
                  <div
                    className="flex space-x-4 mt-4 overflow-hidden scrollbar-hide"
                    ref={scrollRef}
                  >
                    {flashSalesProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center rtl:ml-4 bg-gray-200 rounded-2xl w-64 md:w-72 flex-shrink-0"
                      >
                        <Link
                          to={`/product/${product?._id}`}
                          className="no-underline text-black font-semibold text-lg hover:text-gray-500"
                        >
                          <img
                            src={typeof product?.product_images === "string" ? `${product?.product_images}` : `${product?.product_images[0]}`}
                            alt={product?.product_name[currentLanguage]}
                            className="h-40 w-full md:h-52 m-4 rounded-t-lg object-contain mx-auto"
                          />
                          <p className="text-center mb-2 text-sm md:text-base">
                            {product?.product_name[currentLanguage]}
                          </p>
                          <div className="flex flex-grow justify-center text-center mb-2">
                            {product?.discount_price &&
                              product?.discount_price !== product?.price ? (
                              <div className="flex">
                                <div className="flex items-center font-bold text-lg md:text-xl mr-2 rtl:ml-2 text-green-500">
                                  {product?.discount_price} {t("DH")}
                                </div>
                                <div className="flex items-center line-through text-xs md:text-sm text-gray-500">
                                  {product?.price} {t("DH")}
                                </div>
                              </div>
                            ) : (
                              <span className="font-bold">{product?.price}{t("DH")}</span>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-0">
                    <Iconify
                      icon="material-symbols-light:chevron-left-rounded"
                      className="text-white text-2xl cursor-pointer bg-lime-600 rounded-md hover:text-gray-300"
                      onClick={() => scroll("left", scrollRef, 300)}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-0">
                    <Iconify
                      icon="material-symbols-light:chevron-right-rounded"
                      className="text-white text-2xl cursor-pointer bg-lime-600 rounded-md hover:text-gray-300"
                      onClick={() => scroll("right", scrollRef, 300)}
                      width={32}
                      height={32}
                    />
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
