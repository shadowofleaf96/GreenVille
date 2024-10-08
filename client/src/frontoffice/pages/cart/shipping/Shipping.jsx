import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { countries } from "countries-list";
import { saveShippingInfo } from "../../../../redux/frontoffice/cartSlice";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const Shipping = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const countriesList = Object.values(countries);
    const { cartItems, shippingInfo } = useSelector((state) => state.carts);

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

    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [country, setCountry] = useState("Morocco");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }));
        history("/confirm", { replace: true });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <MetaData title={"Shipping"} />
            <div className="py-2 my-8 mx-4 md:mx-8">
                <CheckoutSteps shipping />
                <div className="flex flex-col lg:flex-row justify-center items-start lg:gap-8">
                    <div className="bg-white shadow-lg rounded-xl p-6 mt-4 w-full lg:w-1/3">
                        <form onSubmit={submitHandler}>
                            <h4 className="text-xl font-semibold mb-6">Shipping Credentials</h4>
                            <div className="grid grid-cols-1 gap-4 mb-4 mt-4">
                                {/* Address Field */}
                                <div className="grid grid-cols-1 gap-2">
                                    <label htmlFor="address_field" className="text-gray-800 font-semibold">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address_field"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                        className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200 w-full"
                                    />
                                </div>

                                {/* City Field */}
                                <div className="grid grid-cols-1 gap-2">
                                    <label htmlFor="city_field" className="text-gray-800 font-semibold">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city_field"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200 w-full"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div className="grid grid-cols-1 gap-2">
                                    <label htmlFor="phone_field" className="text-gray-800 font-semibold">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone_field"
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                        required
                                        className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200 w-full"
                                    />
                                </div>

                                {/* Postal Code Field */}
                                <div className="grid grid-cols-1 gap-2">
                                    <label htmlFor="postal_code_field" className="text-gray-800 font-semibold">
                                        Postal Code
                                    </label>
                                    <input
                                        type="number"
                                        id="postal_code_field"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                        className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200 w-full"
                                    />
                                </div>

                                {/* Country Field */}
                                <div className="grid grid-cols-1 gap-2">
                                    <label htmlFor="country_field" className="text-gray-800 font-semibold">
                                        Country
                                    </label>
                                    <select
                                        id="country_field"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                        className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200 w-full"
                                    >
                                        {countriesList.map((country) => (
                                            <option key={country.name} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-[#8DC63F] text-white font-medium py-3 px-8 rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="w-full lg:w-1/3 my-4">
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
    );
};

export default Shipping;
