import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";

const ConfirmOrder = () => {
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { customer } = useSelector((state) => state.auth);

    const history = useNavigate();

    const itemsPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice,
        };

        sessionStorage.setItem("orderInfo", JSON.stringify(data));
        history.push("/payment");
    };

    return (
        <Fragment>
            <MetaData title={"Confirm Order"} />
            <Navbar />
            <div className="mt-10 px-4">
                <div className="container mx-auto">
                    <CheckoutSteps shipping confirmOrder />

                    <div className="flex flex-col lg:flex-row justify-between mt-8">
                        {/* Shipping Info and Cart Items */}
                        <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
                            <h4 className="text-lg font-semibold mb-3">Shipping Info</h4>
                            <p className="text-gray-700 mb-2">
                                <b>Name:</b> {customer && customer.name}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <b>Phone:</b> {shippingInfo.phoneNo}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                            </p>

                            <hr className="my-4" />

                            <h4 className="text-lg font-semibold mt-4">Your Cart Items:</h4>

                            {cartItems.map((item) => (
                                <Fragment key={item.product}>
                                    <hr className="my-2" />
                                    <div className="flex items-center py-2">
                                        <div className="w-1/4 lg:w-1/6">
                                            <img
                                                src={item.image}
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
                                                {item.quantity} x ${item.price} ={" "}
                                                <b>${(item.quantity * item.price).toFixed(2)}</b>
                                            </p>
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                        </div>

                        <div className="w-full lg:w-1/3">
                            <div className="bg-blue-50 p-4 rounded-lg shadow">
                                <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
                                <hr className="mb-4" />
                                <p className="flex justify-between mb-2">
                                    Subtotal: <span>${itemsPrice}</span>
                                </p>
                                <p className="flex justify-between mb-2">
                                    Shipping: <span>${shippingPrice}</span>
                                </p>
                                <p className="flex justify-between mb-2">
                                    Tax: <span>${taxPrice}</span>
                                </p>

                                <hr className="my-4" />

                                <p className="flex justify-between text-xl font-bold">
                                    Total: <span>${totalPrice}</span>
                                </p>

                                <hr className="my-4" />

                                <button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg mt-4"
                                    onClick={processToPayment}
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ConfirmOrder;
