import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails, clearErrors } from "../../../redux/frontoffice/productSlice";
import Loader from "../../components/loader/Loader";
import Avatar from "@mui/material/Avatar";
import Iconify from "../../../backoffice/components/iconify";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";
import MetaData from "../../components/MetaData";
import createAxiosInstance from "../../../utils/axiosConfig";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import optimizeImage from "../../components/optimizeImage";

const backend = import.meta.env.VITE_BACKEND_URL;

const SingleProduct = () => {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [commentary, setCommentary] = useState("");
  const axiosInstance = createAxiosInstance("customer");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const currentLanguage = i18n.language;

  const { loading, product } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, id]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/reviews/${id}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (product?.product_images && product?.product_images.length > 0) {
      setSelectedImage(`${product.product_images[0]}`);
    }
  }, [product?.product_images]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (product?.product_images.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % product.product_images.length);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [product?.product_images]);

  useEffect(() => {
    if (product?.product_images.length > 0) {
      setSelectedImage(`${product.product_images[currentIndex]}`);
    }
  }, [currentIndex, product?.product_images]);

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

  const handleCommentarySubmit = () => {
    if (!commentary.trim()) {
      alert(t("Please enter a valid comment"));
      return;
    }
    console.log("Comment submitted:", commentary);
    setCommentary("");
  };


  const buyNow = () => {
    dispatch(addItemToCart({ id: product._id, quantity }));
    navigate("/cart");
  };

  return (
    <Fragment>
      <MetaData title={product?.product_name[currentLanguage]} />
      <div className="w-full h-auto flex flex-col items-center justify-center p-8 my-6">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-5xl">
              {product ? (
                <>
                  <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                    {selectedImage && (
                      <AnimatePresence>
                        {selectedImage && (
                          <div className="w-full max-w-sm rounded-lg shadow-lg overflow-hidden mb-6">
                            <motion.img
                              key={selectedImage}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "easeInOut",
                              }}
                              src={optimizeImage(selectedImage, 600)}
                              alt={t("selected_product")}
                              className="object-contain w-full h-[200px] sm:h-[250px]"
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    )}

                    <div className="flex overflow-x-auto space-x-4">
                      {Array.isArray(product?.product_images) ? (
                        product.product_images.map((image, index) => (
                          <img
                            key={index}
                            src={`${optimizeImage(image, 60)}`}
                            alt={`${t("product_image")} ${index + 1}`}
                            className={`w-10 h-10 md:w-12 md:h-12 object-contain cursor-pointer border-2 border-gray-300 rounded-lg hover:border-green-500 ${currentIndex === index ? 'border-green-500' : ''
                              }`}
                            onClick={() => {
                              setSelectedImage(`/${image}`);
                              setCurrentIndex(index);
                            }}
                          />
                        ))
                      ) : (
                        <img
                          src={`${optimizeImage(product.product_images, 60)}`}
                          alt={t("main_product")}
                          className={`w-14 h-14 object-contain cursor-pointer border-2 shadow-lg border-gray-300 rounded-lg hover:border-green-500 ${currentIndex === 0 ? 'border-green-500' : ''}`} // Highlight selected image
                          onClick={() => {
                            setSelectedImage(`/${product.product_images}`);
                            setCurrentIndex(0);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 flex flex-col space-y-4 p-4">
                    <div className="product_description">
                      <h4 className="text-3xl font-bold mb-4">{product.product_name[currentLanguage]}</h4>
                      <h2 className="text-2xl font-bold mb-4 text-green-600">
                        {product.discount_price} {t("currency")}{" "}
                        <strike className="text-sm font-medium text-gray-400">
                          {product.price} {t("currency")}
                        </strike>
                      </h2>
                      <p className="text-gray-600 my-4 h-auto min-h-16">{product.short_description[currentLanguage]}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, index) => {
                            const star = index + 1;
                            return (
                              <Iconify
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-transform transform hover:scale-125 ${(product.average_rating / product.total_reviews) >= star ? "text-yellow-500" : "text-gray-300"
                                  }`}
                                icon="ic:round-star-rate"
                                width={26}
                                height={26}
                              />
                            );
                          })}
                        </div>
                        <span>
                          {product.total_reviews > 0
                            ? (product.average_rating / product.total_reviews).toFixed(2)
                            : "0"}
                        </span>
                        <span>({product.total_reviews} {t("Reviews")})</span>
                      </div>
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
            <div className="mt-8 w-full max-w-5xl">
              <div className="flex space-x-6 border-b-2 pb-4 mb-6">
                <button
                  className={`${activeTab === "description"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-green-600"
                    } font-semibold text-lg transition-all duration-300`}
                  onClick={() => setActiveTab("description")}
                >
                  {t("Product Description")}
                </button>
                <button
                  className={`${activeTab === "commentary"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-green-600"
                    } font-semibold text-lg transition-all duration-300`}
                  onClick={() => setActiveTab("commentary")}
                >
                  {t("Comments")}
                </button>
              </div>

              {activeTab === "description" && (
                <div className="mt-6">
                  <p className="text-gray-700 text-lg flex items-center justify-center min-h-48">{product?.long_description[currentLanguage]}</p>
                </div>
              )}
              {activeTab === "commentary" && (
                <div className="mt-6">
                  {reviews.length === 0 ? (
                    <div className="flex items-center justify-center min-h-48">
                      <p className="text-gray-700 text-center">{t("noReviews")}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-center min-h-48"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Avatar
                                className="text-white font-semibold"
                                src={review.customer_id.customer_image}
                                alt={
                                  review.customer_id.first_name?.toUpperCase() +
                                  review.customer_id.last_name?.toUpperCase()
                                }
                              />
                            </div>
                            <div>
                              <p className="text-gray-800 font-semibold">
                                {review.customer_id.first_name +
                                  " " +
                                  review.customer_id.last_name}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {new Date(review.review_date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default SingleProduct;
