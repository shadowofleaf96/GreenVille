import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { useTranslation } from "react-i18next";  // Import useTranslation hook
const backend = import.meta.env.VITE_BACKEND_URL;

const ConfirmOrder = () => {
    const { t } = useTranslation(); // Initialize translation
    const { cartItems, shippingInfo } = useSelector((state) => state.carts);
    const { customer } = useSelector((state) => state.customers);

    const history = useNavigate();

    const itemsPrice = cartItems.reduce(
        (acc, item) => acc + item.discountPrice * item.quantity,
        0
    );

    if (itemsPrice === 0) {
        history("/products");
    }

    let shippingPrice = itemsPrice <= 1500 ? 15 : 0;
    const taxPrice = Number((0.20 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        history("/payment", { replace: true });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <MetaData title={t("Confirm Order")} />  {/* Use i18n */}
            <div className="container py-2 my-8 mx-auto ">
                <CheckoutSteps shipping confirmOrder />
                <div className="flex flex-col md:flex-row justify-between gap-6 mx-4 md:mx-8">
                    <div className="mb-8 bg-white shadow-lg p-8 rounded-2xl border border-gray-200 w-full md:w-3/5">
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
                                            src={typeof item?.image === "string" ? `${backend}/${item?.image}` : `${backend}/${item?.image[0]}`}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </div>
                                    <div className="w-1/2 lg:w-1/2">
                                        <Link to={`/products/${item.product}`} className="text-blue-600 hover:underline">
                                            {item.name}
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
                            {t("Proceed to Payment")}  {/* Use i18n */}
                        </button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg shadow w-full md:w-2/5 max-h-64">
                        <h4 className="text-lg font-semibold mb-4">{t("Order Summary")}</h4>
                        <hr className="mb-4" />
                        <p className="flex justify-between mb-2">
                            {t("Subtotal")} <span>{itemsPrice} DH</span>
                        </p>
                        <p className="flex justify-between mb-2">
                            {t("Shipping")} <span>{shippingPrice} DH</span>
                        </p>
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
        </div>
    );
};

export default ConfirmOrder;
