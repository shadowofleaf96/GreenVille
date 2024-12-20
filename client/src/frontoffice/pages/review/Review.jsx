import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import DOMPurify from "dompurify";
import createAxiosInstance from "../../../utils/axiosConfig";
import Iconify from "../../../backoffice/components/iconify";
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from "react-toastify";

const Review = ({ productId, customerId, closeModal }) => {
  const { t, i18n } = useTranslation();
  const [productInfo, setProductInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const axiosInstance = createAxiosInstance("customer");
  const currentLanguage = i18n.language;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProductInfo(response.data.data);
      } catch (error) {
        console.error("Failed to fetch product information", error);
      }
    };
    fetchProductInfo();
  }, [axiosInstance, productId]);

  const onSubmit = async (data) => {
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
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        {t("leaveReview")}
      </h2>

      {productInfo && (
        <div className="mb-6 text-center">
          <img
            src={productInfo?.product_images[0]}
            alt={productInfo?.product_name[currentLanguage]}
            className="w-32 h-32 mx-auto object-cover rounded-lg"
          />
          <h3 className="text-xl font-semibold text-gray-800 mt-4">
            {productInfo?.product_name[currentLanguage]}
          </h3>
          <p className="text-sm text-gray-600">{productInfo?.short_description[currentLanguage]}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label htmlFor="rating" className="block text-lg font-medium text-gray-700">
            {t("rating")}
          </label>
          <div className="flex items-center mt-3 space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Iconify
                key={star}
                className={`w-8 h-8 cursor-pointer transition-transform transform hover:scale-125 ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => setRating(star)}
                icon="ic:round-star-rate"
                width={26}
                height={26}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="comment" className="block text-lg font-medium text-gray-700">
            {t("comment")}
          </label>
          <textarea
            id="comment"
            rows="4"
            className="w-full mt-3 p-4 border bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("comment", {
              required: t("commentRequired"),
              maxLength: {
                value: 500,
                message: t("commentTooLong"),
              },
            })}
          ></textarea>
          {errors.comment && (
            <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
          )}
        </div>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={submitDisabled}
          fullWidth
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md !py-3 !mt-4 !font-medium"
        >
          {submitDisabled ? t("Loading...") : t("submitReview")}
        </LoadingButton>
      </form>
    </div>
  );
};

export default Review;