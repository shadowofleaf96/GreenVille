import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import {
    addItemToCart,
    removeItemFromCart,
} from "../../../../redux/frontoffice/cartSlice";
import createAxiosInstance from '../../../../utils/axiosConfig';

const CheckoutForm = () => {
    const { cartItems, shippingInfo } = useSelector((state) => state.carts);
    const { customer } = useSelector((state) => state.customers);
    const axiosInstance = createAxiosInstance("customer")

    const [loading, setLoading] = useState(false)

    const stripe = useStripe();
    const elements = useElements();
    let orderId
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const itemsPrice = cartItems.reduce(
        (acc, item) => acc + item.discountPrice * item.quantity,
        0
    );

    let shippingPrice;

    if (itemsPrice <= 1500) {
        shippingPrice = 15;
    } else {
        shippingPrice = 0
    }

    const taxPrice = Number((0.20 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            setMessage(paymentIntent.status === "succeeded" ? "Your payment succeeded" : "Unexpected error occurred");
        });
    }, [stripe]);

    const createOrder = async () => {
        setLoading(true);
        try {
            const shipping_address = {
                street: shippingInfo.address,
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state || "",
            };
            const orderData = {
                customer_id: customer._id,
                order_items: cartItems.map(item => ({
                    product_id: item.product,
                    quantity: item.quantity,
                    price: item.discountPrice
                })),
                cart_total_price: totalPrice,
                order_date: new Date(),
                shipping_address,
                shipping_method: "standard",
                shipping_status: "not_shipped",
                order_notes: "testing for now",
                status: "processing",
            };

            const orderResponse = await axiosInstance.post("/orders", orderData);

            return orderResponse.data.order._id;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    const handleCreditCardPayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            orderId = await createOrder();

            e.preventDefault();
            const { error } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (error && (error.type === "card_error" || error.type === "validation_error")) {
                console.log(error.message);
            }
            const paymentData = {
                order_id: orderId,
                amount: totalPrice,
                paymentMethod: "credit_card",
                paymentStatus: "completed",
                currency: "mad"
            };

            await axiosInstance.post("/payments/save-payment-info", paymentData);

            cartItems.forEach(item => {
                dispatch(removeItemFromCart(item.product));
            });
            setLoading(false);
            navigate("/success")
        } catch (error) {
            console.error("Error processing payment:", error);
            setLoading(false);
        }
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <div className='w-full'>
            <form onSubmit={handleCreditCardPayment}>
                <hr className="my-4" />
                <h4 className="mb-4 text-xl font-semibold text-center">Card Info</h4>

                <div className="mt-4">
                    <PaymentElement options={paymentElementOptions} />
                </div>

                <div className="flex justify-center  mt-8">
                    {loading ?
                        <button
                            loading={loading}
                            type="submit"
                            disabled={!stripe}
                            className="h-12 w-3/4 bg-[#8DC63F] text-white rounded-lg flex justify-center text-md font-medium normal-case shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                        >
                            <p className="!text-center text-md normal-case font-medium">Loading</p>
                        </button> :
                        <button
                            loading={loading}
                            type="submit"
                            disabled={!stripe}
                            className="h-12 w-3/4 bg-[#8DC63F] text-white flex justify-center rounded-lg text-md font-medium normal-case shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                        >
                            <p className="w-full flex h-full items-center justify-center text-center text-md normal-case font-medium">Pay with Bank Card</p>
                        </button>
                    }
                </div>
            </form>
        </div>
    )

}

export default CheckoutForm;