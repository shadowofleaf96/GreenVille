import React, { Fragment } from "react";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import { Link } from "react-router-dom";

const Success = () => {
    return (
        <div className="bg-gray-100">
            <MetaData title={"Order Success"} />
            <Navbar />
            <div className="flex flex-col items-center py-8 my-8 justify-center">
                <div className="flex flex-col items-center py-6">
                    <div className="relative flex items-center justify-center mb-8">
                        <svg
                            className="w-32 h-32 text-green-500 animate-bounce"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <circle
                                className="transition-all duration-1000 ease-in-out"
                                fill="#5bb543"
                                cx="24"
                                cy="24"
                                r="22"
                            />
                            <path
                                className="transition-all duration-1000 ease-in-out"
                                fill="none"
                                stroke="#FFF"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 27l5.917 4.917L34 17"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Successful!</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>

                    <div className="flex space-x-4">
                        <Link to="/products"
                            className="px-6 py-3 bg-[#8DC63F] text-white font-medium rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/orders/me"
                            className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-md shadow hover:bg-gray-400 transition-all duration-300"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Success;
