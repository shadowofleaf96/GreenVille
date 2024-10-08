import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer, FUNDING } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import MetaData from "../../../components/MetaData";
import Iconify from "../../../../backoffice/components/iconify";
import CheckoutSteps from "../../../pages/cart/checkoutSteps/CheckoutSteps";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../../../redux/frontoffice/cartSlice";
import CheckoutForm from "./CheckoutForm";
import createAxiosInstance from "../../../../utils/axiosConfig";

const Payment = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  const stripePromise = loadStripe(stripeKey)

  const dispatch = useDispatch();
  let orderId

  const { customer } = useSelector((state) => state.customers);
  const { cartItems, shippingInfo } = useSelector((state) => state.carts);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false)
  const axiosInstance = createAxiosInstance("customer")


  const navigate = useNavigate();


  // if (itemsPrice === 0) {
  //   navigate("/products")
  // }

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
  const priceInUSD = (totalPrice * 10.5 / 100).toFixed(2)

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const response = await axiosInstance.post("/payments/create-stripe-payment", { amount: totalPrice, currency: "mad", isSavingCard: true },
          {
            headers: {
              "Content-Type": "application/json",
            },
          });

        const result = response.data;
        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          console.error("Client secret not found in response");
        }
      } catch (error) {
        console.log("Error fetching client secret:", error);
      }
    };

    fetchStripeKey();
  }, []);

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

  const onCreateOrder = async (data, actions) => {
    orderId = await createOrder();
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: priceInUSD,
          },
        },
      ],
    });
  }

  const onApproveOrder = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        const paymentData = {
          order_id: orderId,
          amount: totalPrice,
          paymentMethod: "paypal",
          paymentStatus: "completed",
          currency: "mad"
        };

        await axiosInstance.post("/payments/save-payment-info", paymentData);

        cartItems.forEach(item => {
          dispatch(removeItemFromCart(item.product));
        });
        navigate("/success")
      }
      catch (error) {
        console.error("Error creating payment:", error);
      }
    });
  }

  const createPayment = async (operation, orderId, currency) => {
    try {
      const paymentData = {
        order_id: orderId,
        amount: totalPrice,
        paymentMethod: paymentMethod,
        paymentStatus: "pending",
        currency: currency
      };

      await axiosInstance.post("/payments" + operation, paymentData);

      cartItems.forEach(item => {
        dispatch(removeItemFromCart(item.product));
      });

      setLoading(false);
      navigate("/success");
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleCODPayment = async (e) => {
    e.preventDefault();
    try {
      orderId = await createOrder();

      await createPayment("/save-payment-info", orderId, "mad");
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-8 w-full">
      <MetaData title={"Payment"} />
      <div className="container py-2 my-8 mx-auto">
        <div className="flex flex-col">
          <CheckoutSteps shipping confirmOrder payment />
        </div>
        <div className="flex flex-col lg:flex-row justify-center mx-4 md:mx-8 mt-8">
          <div className="mb-8 lg:mb-0 bg-white shadow-lg p-8 rounded-2xl mx-auto border border-gray-200 w-full lg:w-1/2">
            <h4 className="mb-4 text-lg font-semibold text-center">Select a Payment Method</h4>
            <div className="flex flex-col md:flex-row justify-center mb-4">
              <label className="flex items-center w-auto mb-2 md:mb-0 md:mr-4 text-left justify-start">
                <Iconify icon="mdi:cod" width={30} height={30} className="mr-2 md:flex-1 " />
                <input
                  type="radio"
                  name="paymentMethod"
                  className="w-5 h-5"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="ml-2">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center mb-2 md:mb-0 md:mr-4 text-left justify-start">
                <Iconify icon="ic:baseline-paypal" width={30} height={30} className="mr-2 md:flex-1" />
                <input
                  type="radio"
                  name="paymentMethod"
                  className="w-5 h-5"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="ml-2">PayPal</span>
              </label>
              <label className="flex items-center text-left justify-start">
                <Iconify icon="material-symbols-light:credit-card" width={30} height={30} className="mr-2 md:flex-1" />
                <input
                  type="radio"
                  name="paymentMethod"
                  className="w-5 h-5"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="ml-2">Credit Card</span>
              </label>
            </div>

            {paymentMethod === "cod" && (
              <div>
                <hr className="my-4" />
                <div className="flex justify-center mt-6">
                  {loading ? (
                    <button
                      loading={loading}
                      onClick={handleCODPayment}
                      className="h-12 w-3/4 bg-[#b3b4b1] text-white rounded-lg text-md font-medium normal-case shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400 flex justify-center items-center"
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <p className="!text-center text-md normal-case font-medium">Loading</p>
                      </div>
                    </button>
                  ) : (
                    <button
                      loading={loading}
                      onClick={handleCODPayment}
                      className="h-12 w-3/4 bg-[#8DC63F] text-white rounded-lg !text-center text-md normal-case font-medium shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                    >
                      <p className="!text-center text-md normal-case font-medium">Confirm Pay</p>
                    </button>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="flex justify-center mt-8">
                <PayPalButtons
                  style={{ layout: "vertical", label: "pay", height: 50 }}
                  createOrder={(data, actions) => onCreateOrder(data, actions)}
                  onApprove={(data, actions) => onApproveOrder(data, actions)}
                  fundingSource={FUNDING.PAYPAL}
                />
              </div>
            )}

            {paymentMethod === "creditCard" && (
              <div className="flex justify-center">
                {clientSecret && (
                  <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                )}
              </div>
            )}
          </div>

          <div className="w-full md:mx-8 lg:w-1/2">
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
              <hr className="mb-4" />
              <p className="flex justify-between mb-2">
                Subtotal <span>{itemsPrice} DH</span>
              </p>
              <p className="flex justify-between mb-2">
                Shipping <span>{shippingPrice} DH</span>
              </p>
              <p className="flex justify-between mb-2">
                Tax <span>{taxPrice} DH</span>
              </p>
              <hr className="my-4" />
              <p className="flex justify-between text-xl font-bold">
                Total <span>{totalPrice} DH</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment