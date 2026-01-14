import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct, useReviews } from "../../../services/api/product.queries";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import Loader from "../../components/loader/Loader";
import Iconify from "../../../backoffice/components/iconify";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";
import MetaData from "../../components/MetaData";
import optimizeImage from "../../components/optimizeImage";
import LazyImage from "../../../components/lazyimage/LazyImage";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const SingleProduct = () => {
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentLanguage = i18n.language;

  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(id);

  const loading = productLoading || reviewsLoading;

  const [variantSelections, setVariantSelections] = useState({});

  useEffect(() => {
    if (id) {
      setVariantSelections({});
      setQuantity(1);
    }
  }, [id]);

  useEffect(() => {
    if (product?.product_images && product?.product_images.length > 0) {
      setSelectedImage(`${product?.product_images[0]}`);
    }
  }, [product?.product_images]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (product?.product_images?.length > 0) {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % product?.product_images?.length
        );
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [product?.product_images]);

  useEffect(() => {
    if (product?.product_images?.length > 0) {
      setSelectedImage(`${product?.product_images[currentIndex]}`);
    }
  }, [currentIndex, product?.product_images]);

  const handleVariantToggle = (variantId) => {
    setVariantSelections((prev) => ({
      ...prev,
      [variantId]: {
        selected: !prev[variantId]?.selected,
        quantity: prev[variantId]?.quantity || 1,
      },
    }));
  };

  const handleVariantQuantityChange = (e, variantId, delta) => {
    e.stopPropagation();
    const variant = product?.variants?.find((v) => v._id === variantId);
    if (!variant) return;

    setVariantSelections((prev) => {
      const currentQty = prev[variantId]?.quantity || 1;
      const newQty = currentQty + delta;
      if (newQty < 1 || newQty > variant.quantity) return prev;
      return {
        ...prev,
        [variantId]: {
          ...prev[variantId],
          quantity: newQty,
        },
      };
    });
  };

  const getSelectedTotal = () => {
    return Object.entries(variantSelections)
      .filter(([_, data]) => data.selected) // eslint-disable-line no-unused-vars
      .reduce((total, [variantId, data]) => {
        const variant = product?.variants?.find((v) => v._id === variantId);
        return total + (variant?.price || 0) * data.quantity;
      }, 0);
  };

  const getSelectedCount = () => {
    return Object.values(variantSelections).filter((data) => data.selected)
      .length;
  };

  const getCurrentStock = () => {
    if (product?.variants?.length > 0) return 999;
    return product?.quantity || 0;
  };

  const increaseQty = () => {
    if (quantity >= getCurrentStock()) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addToCart = () => {
    if (product?.variants?.length > 0) {
      const selectedVariants = Object.entries(variantSelections)
        .filter(([_, data]) => data.selected) // eslint-disable-line no-unused-vars
        .map(([variantId, data]) => ({ variantId, quantity: data.quantity }));

      if (selectedVariants.length === 0) {
        toast.error(t("Please select at least one variant"));
        return;
      }

      selectedVariants.forEach(({ variantId, quantity }) => {
        dispatch(
          addItemToCart({
            id: product._id,
            quantity: quantity,
            variantId: variantId,
            product,
          })
        );
      });
      setVariantSelections({});
    } else {
      dispatch(
        addItemToCart({ id: product._id, quantity, variant: null, product })
      );
    }
    toast.success(t("itemAdded"));
  };

  const buyNow = () => {
    addToCart();
    // Only navigate if we actually added something
    if (product?.variants?.length > 0) {
      if (getSelectedCount() > 0) navigate("/cart");
    } else if (getCurrentStock() > 0) {
      navigate("/cart");
    }
  };

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Iconify icon="solar:box-minimalistic-bold-duotone" width={40} />
          </div>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">
            {t("Product not found")}
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            className="font-bold text-primary"
          >
            {t("Back to Shop")}
          </Button>
        </div>
      </div>
    );
  }

  // Trust the reviews array for the most accurate current data
  const totalReviewsFromList = reviews.length;
  const averageRatingFromList =
    totalReviewsFromList > 0
      ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviewsFromList
      : 0;

  // Use product meta as fallback if needed, but prioritize actual reviews list
  const displayRating =
    totalReviewsFromList > 0
      ? averageRatingFromList
      : product.average_rating || 0;

  const displayReviewCount = Math.max(
    totalReviewsFromList,
    product.total_reviews || 0
  );

  return (
    <Fragment>
      <MetaData title={product?.product_name?.[currentLanguage] || ""} />

      <div className="min-h-screen bg-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Image Gallery */}
            <div className="space-y-6 sm:space-y-8">
              <div className="relative aspect-square bg-gray-50/50 rounded-4xl sm:rounded-[3rem] p-6 sm:p-10 flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <LazyImage
                      src={optimizeImage(selectedImage, 800)}
                      alt={product?.product_name?.[currentLanguage]}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 z-20">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setCurrentIndex(
                        (prev) =>
                          (prev - 1 + product.product_images.length) %
                          product.product_images.length
                      )
                    }
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 backdrop-blur shadow-lg text-gray-500 hover:text-primary transition-all"
                  >
                    <Iconify
                      icon="solar:alt-arrow-left-bold-duotone"
                      width={18}
                      className="sm:w-5 sm:h-5"
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setCurrentIndex(
                        (prev) => (prev + 1) % product.product_images.length
                      )
                    }
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 backdrop-blur shadow-lg text-gray-500 hover:text-primary transition-all"
                  >
                    <Iconify
                      icon="solar:alt-arrow-right-bold-duotone"
                      width={18}
                      className="sm:w-5 sm:h-5"
                    />
                  </Button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-2 scrollbar-none">
                {product.product_images?.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    onClick={() => setCurrentIndex(index)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border-2 transition-all cursor-pointer bg-gray-50 ${
                      currentIndex === index
                        ? "border-primary shadow-lg shadow-primary/10"
                        : "border-gray-100 hover:border-primary/20"
                    }`}
                  >
                    <LazyImage
                      src={optimizeImage(image, 100)}
                      alt={`Thumb ${index}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/10 text-primary font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                    {product?.category?.category_name?.[currentLanguage]}
                  </Badge>
                  {product.vendor?.store_name && (
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Sold by")}:
                      <span className="text-primary">
                        {product.vendor.store_name}
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                  {product.product_name?.[currentLanguage]}
                </h1>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Iconify
                        key={i}
                        icon={
                          i < Math.floor(displayRating)
                            ? "solar:star-bold"
                            : i < displayRating
                              ? "solar:star-bold-duotone"
                              : "solar:star-linear"
                        }
                        width={20}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-black text-gray-900">
                    {displayRating.toFixed(1)}
                  </span>
                  <Separator
                    orientation="vertical"
                    className="h-4 bg-gray-200"
                  />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {displayReviewCount} {t("Reviews")}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                  {product?.variants?.length > 0
                    ? getSelectedCount() > 0
                      ? getSelectedTotal().toFixed(2)
                      : Math.min(...product.variants.map((v) => v.price))
                    : product.discount_price || product.price}
                  <span className="text-xl ml-1">{t("DH")}</span>
                </span>
                {product.discount_price &&
                  product.discount_price !== product.price && (
                    <span className="text-lg font-bold text-gray-400 line-through decoration-red-500/50">
                      {product.price} {t("DH")}
                    </span>
                  )}
              </div>

              <Separator className="bg-gray-100" />

              {/* Variants or Quantity */}
              {product?.variants?.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    {getSelectedCount() > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary font-black"
                      >
                        {getSelectedCount()} {t("selected")}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.variants.map((v) => {
                      const isSelected = variantSelections[v._id]?.selected;
                      const vQty = variantSelections[v._id]?.quantity || 1;
                      const isOut = v.quantity <= 0;

                      return (
                        <motion.div
                          key={v._id}
                          whileHover={!isOut ? { y: -2 } : {}}
                          onClick={() => !isOut && handleVariantToggle(v._id)}
                          className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                              : "border-gray-100 bg-white"
                          } ${
                            isOut
                              ? "opacity-40 grayscale cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-primary animate-in zoom-in">
                              <Iconify
                                icon="solar:check-circle-bold"
                                width={20}
                              />
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <p className="font-black text-sm text-gray-900 uppercase tracking-tight truncate pr-6">
                                {v.variant_name}
                              </p>
                              <p className="font-black text-primary">
                                {v.price} {t("DH")}
                              </p>
                            </div>
                            {isSelected && (
                              <div
                                className="flex items-center justify-between bg-white p-1 rounded-xl border border-gray-100 shadow-inner overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) =>
                                    handleVariantQuantityChange(e, v._id, -1)
                                  }
                                  disabled={vQty <= 1}
                                  className="h-7 w-7 rounded-lg"
                                >
                                  <Iconify
                                    icon="solar:minus-circle-bold-duotone"
                                    width={18}
                                  />
                                </Button>
                                <span className="text-xs font-black">
                                  {vQty}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) =>
                                    handleVariantQuantityChange(e, v._id, 1)
                                  }
                                  disabled={vQty >= v.quantity}
                                  className="h-7 w-7 rounded-lg"
                                >
                                  <Iconify
                                    icon="solar:add-circle-bold-duotone"
                                    width={18}
                                  />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                    {t("Quantity")}
                  </h3>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1 shadow-inner h-12 sm:h-14">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={decreaseQty}
                        disabled={quantity <= 1}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-gray-400 hover:text-primary"
                      >
                        <Iconify
                          icon="solar:minus-square-bold-duotone"
                          width={24}
                          className="sm:w-7 sm:h-7"
                        />
                      </Button>
                      <input
                        readOnly
                        value={quantity}
                        className="w-12 sm:w-16 bg-transparent text-center font-black text-base sm:text-lg focus:outline-none"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={increaseQty}
                        disabled={quantity >= getCurrentStock()}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-gray-400 hover:text-primary"
                      >
                        <Iconify
                          icon="solar:add-square-bold-duotone"
                          width={24}
                          className="sm:w-7 sm:h-7"
                        />
                      </Button>
                    </div>
                    <Badge
                      className={`${
                        getCurrentStock() > 0
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      } font-black uppercase tracking-widest px-4 py-2 rounded-full border-none`}
                    >
                      {getCurrentStock() > 0
                        ? `${t("In Stock")} (${getCurrentStock()})`
                        : t("Out of Stock")}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={buyNow}
                  disabled={
                    product?.variants?.length > 0
                      ? getSelectedCount() === 0
                      : getCurrentStock() === 0
                  }
                  className="flex-1 h-16 rounded-4xl bg-gray-900 border-none text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-3"
                >
                  <Iconify icon="solar:bolt-bold-duotone" width={24} />
                  {t("buy_now")}
                </Button>
                <Button
                  onClick={addToCart}
                  variant="outline"
                  disabled={
                    product?.variants?.length > 0
                      ? getSelectedCount() === 0
                      : getCurrentStock() === 0
                  }
                  className="flex-1 h-16 rounded-4xl border-2 border-primary bg-primary/5 text-primary font-black text-base uppercase tracking-widest hover:bg-primary/10 transition-all gap-3"
                >
                  <Iconify
                    icon="solar:cart-large-minimalistic-bold-duotone"
                    width={24}
                  />
                  {t("add_to_cart")}
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-20 bg-gray-100" />

          {/* Bottom Tabs: Description & Reviews */}
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start gap-12 bg-transparent border-b border-gray-100 h-16 rounded-none p-0">
                <TabsTrigger
                  value="description"
                  className="font-black text-lg uppercase tracking-widest text-gray-400 data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 h-full transition-all border-transparent"
                >
                  {t("Product Description")}
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="font-black text-lg uppercase tracking-widest text-gray-400 data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary rounded-none px-0 h-full transition-all border-transparent"
                >
                  {t("Comments")} ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <div className="pt-12">
                <TabsContent
                  value="description"
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <Card className="rounded-[3rem] border-none shadow-2xl shadow-gray-100/50 bg-gray-50/50 p-10">
                    <CardContent className="p-0">
                      <p className="text-lg font-medium text-gray-600 leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                        {product?.long_description?.[currentLanguage] ||
                          product?.short_description?.[currentLanguage]}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="reviews"
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Iconify
                          icon="solar:chat-round-bold-duotone"
                          width={40}
                        />
                      </div>
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">
                        {t("noReviews")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {reviews.map((review) => (
                        <Card
                          key={review._id}
                          className="rounded-[2.5rem] border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 bg-white"
                        >
                          <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-primary/10 p-1 ring-1 ring-gray-100">
                                  <AvatarImage
                                    src={review.customer_id?.customer_image}
                                  />
                                  <AvatarFallback className="bg-primary/5 text-primary font-black">
                                    {review.customer_id?.first_name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                  <p className="font-black text-gray-900 tracking-tight">
                                    {review.customer_id?.first_name}{" "}
                                    {review.customer_id?.last_name}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {new Date(
                                      review.review_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 text-yellow-400">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Iconify
                                    key={i}
                                    icon={
                                      i < review.rating
                                        ? "solar:star-bold"
                                        : "solar:star-linear"
                                    }
                                    width={14}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="relative">
                              <Iconify
                                icon="ooui:quotes-ltr"
                                className="absolute -top-4 -left-2 text-primary/10 scale-[3]"
                                width={24}
                              />
                              <p className="text-gray-600 font-medium leading-relaxed italic relative z-10 pl-4">
                                {review.comment}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SingleProduct;
