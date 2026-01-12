import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import DOMPurify from "dompurify";
import createAxiosInstance from "../../../utils/axiosConfig";
import Iconify from "../../../backoffice/components/iconify";
import { toast } from "react-toastify";
import optimizeImage from "../../components/optimizeImage";
import LazyImage from "../../../components/lazyimage/LazyImage";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Review = ({ productId, customerId, closeModal }) => {
  const { t, i18n } = useTranslation();
  const [productInfo, setProductInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);
  const axiosInstance = createAxiosInstance("customer");
  const currentLanguage = i18n.language;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProductInfo(response.data.data);
      } catch (error) {
        console.error("Failed to fetch product information", error);
      }
    };

    const checkExistingReview = async () => {
      try {
        const response = await axiosInstance.get(`/reviews/${productId}`);
        const reviews = response.data.data;
        const found = reviews.some(
          (rev) =>
            (typeof rev.customer_id === "string"
              ? rev.customer_id
              : rev.customer_id?._id) === customerId,
        );
        setAlreadyReviewed(found);
      } catch (error) {
        console.error("Failed to check existing reviews", error);
      } finally {
        setCheckingReview(false);
      }
    };

    fetchProductInfo();
    checkExistingReview();
  }, [productId, customerId]);

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.warning(t("Please select a rating"));
      return;
    }

    setSubmitDisabled(true);

    try {
      const sanitizedComment = DOMPurify.sanitize(data.comment);
      const response = await axiosInstance.post("/reviews/", {
        product_id: productId,
        customer_id: customerId,
        rating,
        comment: sanitizedComment,
      });

      if (response.status === 201) {
        toast.success(t("reviewSubmitted"));
        closeModal();
        reset();
      } else {
        toast.error(t("somethingWentWrong"));
      }
    } catch (error) {
      toast.error(t("somethingWentWrong"));
      console.error(error);
    } finally {
      setSubmitDisabled(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <Badge className="bg-primary/5 text-primary font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 border-none mb-4">
          {t("Customer Feedback")}
        </Badge>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
          {t("leaveReview")}
        </h2>
        <p className="text-xs font-bold text-gray-400 italic max-w-xs mx-auto">
          {t(
            alreadyReviewed
              ? "thankYouForFeedback"
              : "Your valuable feedback helps us maintain the highest standards of luxury and quality.",
          )}
        </p>
      </div>

      <Separator className="bg-gray-50" />

      {checkingReview ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Iconify
            icon="svg-spinners:ring-resize"
            width={40}
            className="text-primary"
          />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
            {t("Authenticating Session...")}
          </p>
        </div>
      ) : alreadyReviewed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center space-y-8 py-10"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
            <Iconify icon="solar:check-circle-bold-duotone" width={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 uppercase">
              {t("Already Reviewed")}
            </h3>
            <p className="text-sm font-medium text-gray-500 max-w-xs">
              {t(
                "You have already shared your distinguished experience for this product. Thank you for your review.",
              )}
            </p>
          </div>
          <Button
            onClick={closeModal}
            className="h-14 px-10 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            {t("Close Window")}
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Product Summary */}
          <AnimatePresence mode="wait">
            {productInfo ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <LazyImage
                    src={optimizeImage(productInfo?.product_images?.[0], 400)}
                    alt={productInfo?.product_name[currentLanguage]}
                    className="w-40 h-40 mx-auto object-contain bg-white rounded-3xl p-4 shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    {productInfo?.product_name[currentLanguage]}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-2 max-w-sm italic">
                    {productInfo?.short_description[currentLanguage]}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center py-10 gap-4">
                <div className="w-32 h-32 bg-gray-50 rounded-3xl animate-pulse" />
                <div className="w-48 h-6 bg-gray-50 rounded-full animate-pulse" />
              </div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Rating System */}
            <div className="space-y-6 text-center">
              <Label
                htmlFor="rating"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
              >
                {t("Service Excellence Rating")}
              </Label>
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || rating) >= star;
                  return (
                    <motion.div
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <Iconify
                        className={`w-10 h-10 transition-all duration-300 ${
                          isActive
                            ? "text-primary filter drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
                            : "text-gray-100"
                        }`}
                        icon={
                          isActive ? "solar:star-bold" : "solar:star-linear"
                        }
                      />
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest min-h-4">
                {rating > 0 &&
                  (rating === 5
                    ? t("Exceptional")
                    : rating === 4
                      ? t("High End")
                      : rating === 3
                        ? t("Sophisticated")
                        : rating === 2
                          ? t("Standard")
                          : t("Improvement Needed"))}
              </p>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <Label
                htmlFor="comment"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
              >
                {t("Detailed Testimonial")}
              </Label>
              <div className="relative">
                <Textarea
                  id="comment"
                  rows="5"
                  placeholder={t(
                    "Share your distinguished experience with this selection...",
                  )}
                  className={`w-full rounded-4xl border-gray-100 bg-gray-50/50 p-8 focus:bg-white focus:ring-primary/20 transition-all font-medium text-gray-800 italic resize-none ${
                    errors.comment ? "border-red-500" : ""
                  }`}
                  {...register("comment", {
                    required: t("commentRequired"),
                    maxLength: { value: 500, message: t("commentTooLong") },
                  })}
                />
                <div className="absolute right-6 bottom-6 flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-50 shadow-sm">
                  <Iconify
                    icon="solar:pen-new-square-bold-duotone"
                    width={14}
                    className="text-gray-300"
                  />
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">
                    {t("Verified Entry")}
                  </span>
                </div>
              </div>
              {errors.comment && (
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <Separator className="bg-gray-50" />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitDisabled}
                className="w-full h-16 rounded-4xl bg-gray-900 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4 border-none"
              >
                {submitDisabled ? (
                  <>
                    <Iconify icon="svg-spinners:ring-resize" width={24} />
                    {t("Submitting Testimonial...")}
                  </>
                ) : (
                  <>
                    <Iconify icon="solar:letter-bold-duotone" width={24} />
                    {t("publishReview") || t("Submit Feedback")}
                  </>
                )}
              </Button>
            </div>

            {/* Quality Guarantee Small */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <Iconify
                icon="solar:shield-check-bold-duotone"
                width={20}
                className="text-primary"
              />
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-relaxed text-center italic">
                {t(
                  "Your feedback is reviewed with care to ensure communal quality and authenticity.",
                )}
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Review;
