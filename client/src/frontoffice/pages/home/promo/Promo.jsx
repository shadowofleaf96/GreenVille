import React, { useRef, useEffect } from "react";
import Iconify from "../../../../backoffice/components/iconify";
import { Link } from "react-router-dom";

const Promo = ({ products }) => {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);

  const scroll = (direction, ref) => {
    const { current } = ref;
    if (current) {
      if (direction === "left") {
        current.scrollLeft -= 300;
      } else {
        current.scrollLeft += 300;
      }
    }
  };

  const setupAutoScroll = (ref, intervalTime) => {
    useEffect(() => {
      const interval = setInterval(() => {
        scroll("right", ref);
      }, intervalTime);

      return () => clearInterval(interval);
    }, [ref, intervalTime]);
  };

  const flashSalesProducts = products?.filter((product) =>
    product.option.includes("Flash Sales")
  );
  const newArrivalsProducts = products?.filter((product) =>
    product.option.includes("New Arrivals")
  );
  const topDealsProducts = products?.filter((product) =>
    product.option.includes("Top Deals")
  );

  setupAutoScroll(scrollRef1, 3500); 
  setupAutoScroll(scrollRef2, 5500); 
  setupAutoScroll(scrollRef3, 7500);

  return (
    <div className="relative mt-6 mb-6 select-none">
      <div className="container mx-auto">
        {flashSalesProducts?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">Flash Sales</h4>
              <span className="bg-[#8DC63F] text-white px-4 py-2 rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
                <Link
                  to="/products"
                  className="no-underline font-medium transition-colors duration-300 hover:text-gray-300"
                >
                  See all
                </Link>
              </span>
            </div>
            <div className="relative max-w-full overflow-hidden">
              <div
                className="flex space-x-4 mt-4 overflow-hidden scrollbar-hide"
                ref={scrollRef1}
              >
                {flashSalesProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-gray-200 rounded-2xl w-72 flex-shrink-0"
                  >
                    <Link
                      to={`/product/${product?._id}`}
                      className="no-underline text-black font-semibold text-lg hover:text-gray-500"
                    >
                      <img
                        src={`http://localhost:3000/${product?.product_image}`}
                        alt={product?.product_name}
                        className="h-52 w-full m-4 rounded-t-lg object-contain"
                      />
                      <p className="text-center mb-2">
                        {product?.product_name}
                      </p>
                      <div className="flex flex-grow justify-center text-center mb-2">
                        {product?.discount_price &&
                        product?.discount_price !== product?.price ? (
                          <div className="flex">
                            <div className="flex items-center font-bold text-xl mr-2 text-green-500">
                              {product?.discount_price} DH
                            </div>
                            <div className="flex items-center line-through text-xs text-gray-500">
                              {product?.price} DH
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold">{product?.price}DH</span>
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
                  onClick={() => scroll("left", scrollRef1)}
                  width={32}
                  height={32}
                />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0">
                <Iconify
                  icon="material-symbols-light:chevron-right-rounded"
                  className="text-white text-2xl cursor-pointer bg-lime-600 rounded-md hover:text-gray-300"
                  onClick={() => scroll("right", scrollRef1)}
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        )}

        {newArrivalsProducts?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">New Arrivals</h4>
              <span className="bg-[#8DC63F] text-white px-4 py-2 rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
                <Link
                  to="/products"
                  className="no-underline font-medium transition-colors duration-300 hover:text-gray-300"
                >
                  See all
                </Link>
              </span>
            </div>
            <div className="relative max-w-full overflow-hidden">
              <div
                className="flex space-x-4 mt-4 overflow-hidden scrollbar-hide"
                ref={scrollRef2}
              >
                {newArrivalsProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-gray-200 rounded-2xl w-72 flex-shrink-0"
                  >
                    <Link
                      to={`/product/${product?._id}`}
                      className="no-underline text-black font-semibold text-lg hover:text-grey-500"
                    >
                      <img
                        src={`http://localhost:3000/${product?.product_image}`}
                        alt={product?.product_name}
                        className="h-52 w-full m-4 rounded-t-lg object-contain"
                      />
                      <p className="text-center mb-2">
                        {product?.product_name}
                      </p>
                      <div className="flex flex-grow justify-center text-center mb-2">
                        {product?.discount_price &&
                        product?.discount_price !== product?.price ? (
                          <div className="flex">
                            <div className="flex items-center font-bold text-xl mr-2 text-green-500">
                              {product?.discount_price} DH
                            </div>
                            <div className="flex items-center line-through text-xs text-gray-500">
                              {product?.price} DH
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold">{product?.price}DH</span>
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
                  onClick={() => scroll("left", scrollRef2)}
                  width={32}
                  height={32}
                />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0">
                <Iconify
                  icon="material-symbols-light:chevron-right-rounded"
                  className="text-white text-2xl cursor-pointer bg-lime-600 rounded-md hover:text-gray-300"
                  onClick={() => scroll("right", scrollRef2)}
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        )}

        {topDealsProducts?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">Top Deals</h4>
              <span className="bg-[#8DC63F] text-white px-4 py-2 rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
                <Link
                  to="/products"
                  className="no-underline font-medium transition-colors duration-300 hover:text-gray-300"
                >
                  See all
                </Link>
              </span>
            </div>
            <div className="relative max-w-full overflow-hidden">
              <div
                className="flex space-x-4 mt-4 overflow-hidden scrollbar-hide"
                ref={scrollRef3}
              >
                {topDealsProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-gray-200 rounded-2xl w-72 flex-shrink-0"
                  >
                    <Link
                      to={`/product/${product?._id}`}
                      className="no-underline text-black font-semibold text-lg hover:text-gray-500"
                    >
                      <img
                        src={`http://localhost:3000/${product?.product_image}`}
                        alt={product?.product_name}
                        className="h-52 w-full m-4 rounded-t-lg object-contain"
                      />
                      <p className="text-center mb-2">
                        {product?.product_name}
                      </p>
                      <div className="flex flex-grow justify-center text-center mb-2">
                        {product?.discount_price &&
                        product?.discount_price !== product?.price ? (
                          <div className="flex">
                            <div className="flex items-center font-bold text-xl mr-2 text-green-500">
                              {product?.discount_price} DH
                            </div>
                            <div className="flex items-center line-through text-xs text-gray-500">
                              {product?.price} DH
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold">{product?.price}DH</span>
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
                  onClick={() => scroll("left", scrollRef3)}
                  width={32}
                  height={32}
                />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0">
                <Iconify
                  icon="material-symbols-light:chevron-right-rounded"
                  className="text-white text-2xl cursor-pointer bg-lime-600 rounded-md hover:text-gray-300"
                  onClick={() => scroll("right", scrollRef3)}
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promo;
