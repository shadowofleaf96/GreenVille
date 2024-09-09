import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { countries } from "countries-list";
import { saveShippingInfo } from "../../../../redux/frontoffice/cartSlice";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const Shipping = () => {
    const countriesList = Object.values(countries);
    const { shippingInfo } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [country, setCountry] = useState(shippingInfo.country);

    const dispatch = useDispatch();
    const history = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }));
        history.push("/confirm");
    };

    return (
        <Fragment>
            <MetaData title={"Shipping"} />
            <Navbar />
            <div className="flex flex-col justify-center items-center mb-8">
                <CheckoutSteps shipping />

                <div className="bg-gray-100 shadow-lg rounded-xl p-8 mt-4 w-full max-w-md">
                    <form onSubmit={submitHandler}>
                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="address_field" className="text-gray-800 font-semibold">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address_field"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="city_field" className="text-gray-800 font-semibold">
                                City
                            </label>
                            <input
                                type="text"
                                id="city_field"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="phone_field" className="text-gray-800 font-semibold">
                                Phone
                            </label>
                            <input
                                type="phone"
                                id="phone_field"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                                className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="postal_code_field" className="text-gray-800 font-semibold">
                                Postal Code
                            </label>
                            <input
                                type="number"
                                id="postal_code_field"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                                className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <label htmlFor="country_field" className="text-gray-800 font-semibold">
                                Country
                            </label>
                            <select
                                id="country_field"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                className="h-10 rounded-full border border-gray-300 px-4 bg-gray-200"
                            >
                                {countriesList.map((country) => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-orange-500 text-white py-2 px-8 rounded-full uppercase tracking-wide font-semibold transition-all hover:w-full"
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default Shipping;
