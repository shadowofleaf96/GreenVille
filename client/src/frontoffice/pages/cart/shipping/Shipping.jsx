import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { countries } from "countries-list";
import { toast } from "react-toastify";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { applyCouponCode, saveShippingInfo } from "../../../../redux/frontoffice/cartSlice";
import MetaData from "../../../components/MetaData";
import { LoadingButton } from "@mui/lab";

const Shipping = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const countriesList = Object.values(countries);
  const { customer } = useSelector((state) => state.customers);
  const axiosInstance = createAxiosInstance("customer")
  const { cartItems, shippingInfo } = useSelector((state) => state.carts);

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );

  if (itemsPrice === 0) {
    history("/products");
  }

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [country, setCountry] = useState("Morocco");
  const [saveToProfile, setSaveToProfile] = useState(true);

  const getShippingPrice = () => {
    if (itemsPrice >= 1500) return 0;
    if (shippingMethod === "standard") return 30;
    if (shippingMethod === "express") return 45;
    if (shippingMethod === "overnight") return 65;
    return 0;
  };

  const shippingPrice = getShippingPrice();
  const taxPrice = Number((0.20 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const saveAddressToProfile = async () => {
    setLoading(true);

    try {
      const shipping_address = {
        street: address,
        city,
        postal_code: postalCode,
        phone_no: phoneNo,
        country,
      };

      await axiosInstance.put(`/customers/${customer._id}`, { shipping_address });
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to save address to profile."));
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, taxPrice, shippingPrice, shippingMethod, country }));
      dispatch(applyCouponCode(null));

      if (saveToProfile) {
        await saveAddressToProfile();
      }

      history("/confirm", { replace: true });
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <MetaData title={t("Shipping")} />
      <div className="py-2 my-8 mx-4 md:mx-8">
        <CheckoutSteps shipping />
        <div className="flex flex-col lg:flex-row justify-center items-start lg:gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6 mt-4 w-full lg:w-1/3">
            <form onSubmit={submitHandler}>
              <h4 className="text-xl font-semibold mb-6">
                {t("ShippingCredentials")}
              </h4>
              <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                <div className="grid grid-cols-1 gap-2">
                  <label
                    htmlFor="address_field"
                    className="text-gray-800 font-semibold"
                  >
                    {t("Address")}
                  </label>
                  <input
                    type="text"
                    id="address_field"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="h-10 rounded-md border border-gray-300 px-4 bg-gray-200 w-full"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label
                    htmlFor="city_field"
                    className="text-gray-800 font-semibold"
                  >
                    {t("City")}
                  </label>
                  <input
                    type="text"
                    id="city_field"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="h-10 rounded-md border border-gray-300 px-4 bg-gray-200 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="phone_field" className="text-gray-800 font-semibold">
                      {t("Phone")}
                    </label>
                    <input
                      type="tel"
                      id="phone_field"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      required
                      className="h-10 rounded-md border border-gray-300 px-4 bg-gray-200 w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="postal_code_field" className="text-gray-800 font-semibold">
                      {t("PostalCode")}
                    </label>
                    <input
                      type="number"
                      id="postal_code_field"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="h-10 rounded-md border border-gray-300 px-4 bg-gray-200 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-4">
                  <label htmlFor="shipping_method" className="text-gray-800 font-semibold">
                    {t("Shipping Method")}
                  </label>
                  <select
                    id="shipping_method"
                    onChange={(e) => setShippingMethod(e.target.value)}
                    value={shippingMethod}
                    disabled={itemsPrice >= 1500}
                    className={`h-10 rounded-md border px-4 w-full ${itemsPrice >= 1500 ? "bg-gray-300 text-gray-500" : "bg-gray-200 text-black"
                      }`}
                  >
                    <option value="standard">{t("Standard Shipping")} (30 DH)</option>
                    <option value="express">{t("Express Shipping")} (45 DH)</option>
                    <option value="overnight">{t("Overnight Shipping")} (65 DH)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="save_to_profile" className="text-sm text-gray-600">
                    <input
                      type="checkbox"
                      id="save_to_profile"
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                      className="w-4 h-4 mr-3 accent-[#8DC63F]"
                    />
                    {t("SaveToProfile")}
                  </label>
                </div>
              </div>

              <div className="flex justify-center">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                  className="bg-[#8DC63F] text-white !font-medium !py-3 !px-8 rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                >
                  {loading ? t("Loading...") : t("Continue")}
                </LoadingButton>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-1/3 my-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4">
                {t("OrderSummary")}
              </h4>
              <hr className="mb-4" />
              <p className="flex justify-between mb-2">
                {t("Subtotal")} <span>{itemsPrice} DH</span>
              </p>
              <p className="flex justify-between mb-2">
                {t("ShippingCost")} <span>{shippingPrice} DH</span>
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
    </div>
  );
};

export default Shipping;
