import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../../../components/MetaData";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { applyCouponCode } from "../../../../redux/frontoffice/cartSlice"
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { LoadingButton } from "@mui/lab";
import optimizeImage from "../../../components/optimizeImage";

const backend = import.meta.env.VITE_BACKEND_URL;

const ConfirmOrder = () => {
    const { t, i18n } = useTranslation();
    const { cartItems, shippingInfo, coupon } = useSelector((state) => state.carts);
    const { customer } = useSelector((state) => state.customers);
    const currentLanguage = i18n.language
    const history = useNavigate();
    const [couponCode, setCouponCode] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const axiosInstance = createAxiosInstance("customer")
    const dispatch = useDispatch();


    const itemsPrice = cartItems.reduce((acc, item) => acc + item.discountPrice * item.quantity, 0);

    if (itemsPrice === 0) {
        history("/products");
    }

    let shippingPrice = 30;

    const taxPrice = Number((0.20 * itemsPrice).toFixed(2));
    let discountedTotal
    if (coupon) {
        discountedTotal = itemsPrice - (itemsPrice * coupon.discount) / 100;
    } else {
        discountedTotal = itemsPrice;
    }
    const totalPrice = (discountedTotal + shippingPrice + taxPrice).toFixed(2);

    const applyCoupon = async () => {
        setIsLoading(true);
        const sanitizedCouponCode = DOMPurify.sanitize(couponCode);

        try {
            const response = await axiosInstance.post(`/coupons/apply`, {
                code: sanitizedCouponCode,
                userId: customer._id,
            });
            dispatch(applyCouponCode({ code: response.data.code, discount: response.data.discount }));
            setMessage({ text: t("Coupon applied successfully"), type: "success" });
        } catch (error) {
            setMessage({ text: t("Failed to apply coupon"), type: "error" });
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    };

    const processToPayment = () => {
        history("/payment", { replace: true });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <MetaData title={t("Confirm Order")} />
            <div className="container py-2 my-8 mx-auto">
                <CheckoutSteps shipping confirmOrder />
                <div className="flex flex-col md:flex-row justify-between gap-6 mx-4 md:mx-8">
                    <div className="mb-8 bg-white shadow-lg p-8 rounded-2xl border border-gray-200 w-full md:w-3/5">
                        <div className="mb-4">
                            <label htmlFor="couponCode" className="block text-lg font-semibold mb-2">
                                {t("Coupon Code")}
                            </label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="text"
                                    id="couponCode"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder={t("Enter coupon code")}
                                    className="p-2 w-full rounded-l-md bg-gray-100 focus:border-r-0 border-[#8DC63F] focus:outline-none focus:ring-0 focus:border-transparent"
                                />
                                <LoadingButton
                                    onClick={applyCoupon}
                                    loading={isLoading}
                                    variant="contained"
                                    sx={{ fontWeight: 500, fontSize: 15, borderRadius: 0 }}
                                    className="!bg-[#8DC63F] !shadow-none !transition-shadow !duration-300 !cursor-pointer !hover:shadow-lg !hover:shadow-yellow-400 !text-white !py-2 !px-6 border-0 !rounded-r-md"
                                >
                                    {isLoading ? t('Loading') : t("Apply")}
                                </LoadingButton>
                            </div>
                        </div>
                        {message.text && (
                            <p className={`mt-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                {message.text}
                            </p>
                        )}
                        <hr className="my-2" />

                        <h4 className="text-lg font-semibold mb-3">{t("Shipping Info")}</h4>
                        <p className="text-gray-700 mb-2">
                            <b>{t("Name")}: </b> {customer && `${customer.first_name} ${customer.last_name}`}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <b>{t("Phone")}: </b> {shippingInfo.phoneNo}
                        </p>
                        <p className="text-gray-700 mb-4">
                            <b>{t("Address")}: </b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                        </p>
                        <hr className="my-4" />
                        <h4 className="text-lg font-semibold mt-4">{t("Your Cart Items")}:</h4>
                        {cartItems.map((item) => (
                            <Fragment key={item.product}>
                                <hr className="my-2" />
                                <div className="flex items-center py-2">
                                    <div className="w-1/4 lg:w-1/6">
                                        <img
                                            src={typeof item?.image === "string" ? `${optimizeImage(item?.image, 100)}` : `${optimizeImage(item?.image[0], 100)}`}
                                            alt={item.name[currentLanguage]}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </div>
                                    <div className="w-1/2 lg:w-1/2">
                                        <Link to={`/products/${item.product}`} className="text-blue-600 hover:underline">
                                            {item.name[currentLanguage]}
                                        </Link>
                                    </div>
                                    <div className="w-1/4 lg:w-1/6">
                                        <p className="text-gray-700">
                                            {item.quantity} x {item.discountPrice} DH ={" "}
                                            <b>{(item.quantity * item.discountPrice).toFixed(2)} DH</b>
                                        </p>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                        <button
                            className="w-full bg-[#8DC63F] font-medium shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400 text-white py-3 px-8 rounded-lg mt-4"
                            onClick={processToPayment}
                        >
                            {t("Proceed to Payment")}
                        </button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg shadow w-full md:w-2/5 max-h-72">
                        <h4 className="text-lg font-semibold mb-4">{t("Order Summary")}</h4>
                        <hr className="mb-4" />
                        <p className="flex justify-between mb-2">
                            {t("Subtotal")} <span>{itemsPrice} DH</span>
                        </p>
                        <p className="flex justify-between mb-2">
                            {t("Shipping")} <span>{shippingPrice} DH</span>
                        </p>
                        {coupon && (
                            <p className="flex justify-between mb-2">
                                {t("Coupon")} ({coupon.code} - {coupon.discount}%) <span>-{((itemsPrice * coupon.discount) / 100).toFixed(2)} DH</span>
                            </p>
                        )}
                        <p className="flex justify-between mb-2">
                            {t("Tax")} <span>{taxPrice} DH</span>
                        </p>
                        <hr className="my-4" />
                        <p className="flex justify-between text-xl font-bold">
                            {t("Total")} <span>{totalPrice} DH</span>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ConfirmOrder;
