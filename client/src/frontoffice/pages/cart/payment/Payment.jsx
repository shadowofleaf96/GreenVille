import React, { Fragment, useEffect } from "react";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";

import { clearErrors, createOrder } from "../../../../redux/frontoffice/orderSlice";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const options = {
  style: {
    base: {
      fontSize: "16px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const Payment = ({ history }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { customer } = useSelector((state) => state.customer);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;

    let res;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      res = await axios.post("/api/v1/payment/process", paymentData, config);
      const clientSecret = res.data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: customer.name,
            email: customer.email,
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message);
        document.querySelector("#pay_btn").disabled = false;
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          history.push("/success");
        } else {
          alert.error("There is some issue while payment processing");
        }
      }
    } catch (error) {
      document.querySelector("#pay_btn").disabled = false;
      alert.error(error.response.data.message);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Payment"} />
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <div className="container mx-auto">
          <CheckoutSteps shipping confirmOrder payment />

          <div className="bg-white shadow-lg p-8 rounded-2xl max-w-md mx-auto mt-10 border border-gray-200">
            <form onSubmit={submitHandler}>
              <h4 className="mb-4 text-xl font-semibold text-center">Card Info</h4>
              
              <div className="flex flex-col gap-3 mt-4">
                <label htmlFor="card_num_field" className="font-medium text-gray-700">Card Number</label>
                <CardNumberElement
                  type="text"
                  id="card_num_field"
                  options={options}
                  className="h-12 px-4 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <label htmlFor="card_exp_field" className="font-medium text-gray-700">Card Expiry</label>
                <CardExpiryElement
                  type="text"
                  id="card_exp_field"
                  options={options}
                  className="h-12 px-4 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <label htmlFor="card_cvc_field" className="font-medium text-gray-700">Card CVC</label>
                <CardCvcElement
                  type="text"
                  id="card_cvc_field"
                  options={options}
                  className="h-12 px-4 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-center mt-6">
                <button
                  id="pay_btn"
                  type="submit"
                  className="h-12 w-3/4 bg-yellow-500 text-white rounded-full uppercase font-medium tracking-wider hover:bg-yellow-600 transition duration-300"
                >
                  Pay {` - ${orderInfo && orderInfo.totalPrice}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Payment;
