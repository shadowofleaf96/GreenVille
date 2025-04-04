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
  applyCouponCode,
  removeItemFromCart,
} from "../../../../redux/frontoffice/cartSlice";
import CheckoutForm from "./CheckoutForm";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";

const Payment = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  const stripePromise = loadStripe(stripeKey)

  const dispatch = useDispatch();
  let orderId
  const { t } = useTranslation();


  const { customer } = useSelector((state) => state.customers);
  const { cartItems, shippingInfo, coupon } = useSelector((state) => state.carts);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false)
  const axiosInstance = createAxiosInstance("customer")


  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );

  // if (itemsPrice === 0) {
  //   navigate("/products")
  // }

  const totalPriceUSD = (shippingInfo?.totalPrice * 0.11).toFixed(2);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const response = await axiosInstance.post("/payments/create-stripe-payment", { amount: shippingInfo?.totalPrice, currency: "mad", isSavingCard: true },
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
        console.error("Error fetching client secret:", error);
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
        phone_no: shippingInfo.phoneNo,
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
        tax: shippingInfo.taxPrice,
        order_date: new Date(),
        shipping_address,
        coupon_discount: Number(shippingInfo?.discountedPrice) || 0,
        shipping_price: shippingInfo.shippingPrice,
        cart_total_price: shippingInfo.totalPrice,
        shipping_method: shippingInfo.shippingMethod,
        shipping_status: "not_shipped",
        order_notes: "Your order is being processed with care. We will notify you once it's ready for shipment.",
        status: "processing",
      };

      const orderResponse = await axiosInstance.post("/orders", orderData);
      return orderResponse.data.order._id;
    } catch (error) {
      setLoading(false);
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
            value: totalPriceUSD,
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
          amount: shippingInfo?.totalPrice,
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
        amount: shippingInfo?.totalPrice,
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
            <h4 className="mb-4 text-lg font-semibold text-center">{t("SelectPaymentMethod")}</h4>
            <div className="flex flex-col md:flex-row justify-center mb-4">
              <label className="flex items-center w-auto mb-2 md:mb-0 md:mr-4 text-left justify-start">
                <Iconify icon="mdi:cod" width={30} height={30} className="mr-2 md:flex " />
                <input
                  type="radio"
                  name="paymentMethod"
                  className="w-5 h-5"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="ml-2">{t("CashOnDelivery")}</span>
              </label>
              <label className="flex items-center mb-2 md:mb-0 md:mr-4 text-left justify-start">
                <Iconify icon="ic:baseline-paypal" width={30} height={30} className="mr-2 md:flex" />
                <input
                  type="radio"
                  name="paymentMethod"
                  className="w-5 h-5"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="ml-2">{t("PayPal")}</span>
              </label>
              <label className="flex items-center text-left justify-start">
                <Iconify icon="material-symbols-light:credit-card" width={30} height={30} className="mr-2 md:flex" />
                <input
                  type="radio"
                  name="paymentMethod"
                  className="w-5 h-5"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={handlePaymentMethodChange}
                />
                <span className="ml-2">{t("CreditCard")}</span>
              </label>
            </div>

            {paymentMethod === "cod" && (
              <div>
                <hr className="my-4" />
                <div className="flex justify-center mt-6">
                  <LoadingButton
                    fullWidth
                    loading={loading}
                    variant="contained"
                    sx={{ fontWeight: 500, fontSize: 15 }}
                    className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2"
                    loadingPosition="center"
                    onClick={handleCODPayment}
                  >
                    {loading ? t('Loading') : t("ConfirmPay")}
                  </LoadingButton>
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


          <div className="bg-blue-50 p-4 rounded-lg shadow w-full md:w-2/5 max-h-72">
            <h4 className="text-lg font-semibold mb-4">{t("Order Summary")}</h4>
            <hr className="mb-4" />
            <p className="flex justify-between mb-2">
              {t("Subtotal")} <span>{itemsPrice} DH</span>
            </p>
            <p className="flex justify-between mb-2">
              {t("Shipping")} <span>{shippingInfo?.shippingPrice} DH</span>
            </p>
            {coupon && (
              <p className="flex justify-between mb-2">
                {t("Coupon")} ({coupon.code} - {coupon.discount}%) <span>-{((itemsPrice * coupon.discount) / 100).toFixed(2)} DH</span>
              </p>
            )}
            <p className="flex justify-between mb-2">
              {t("Tax")} <span>{shippingInfo?.taxPrice} DH</span>
            </p>
            <hr className="my-4" />
            <p className="flex justify-between text-xl font-bold">
              {t("Total")} <span>{shippingInfo?.totalPrice} DH</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment