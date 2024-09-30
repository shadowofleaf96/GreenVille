import React from "react"
import { Link } from "react-router-dom"
import Iconify from "../../../../backoffice/components/iconify"

export default function CTA() {
    return (
        <section className="px-4 mt-6 mb-6 mx-auto max-w-8xl">
            <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
                <h1 className="flex flex-col justify-center items-center mb-6 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
                    <span className="block">
                        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DC63F] to-green-500">the Power of Organic Living</span>
                    </span>
                    <span className="flex justify-center items-center mt-4">
                        at
                        <img className="h-24 w-auto bg-cover mx-4" src="/assets/logo-text.webp" alt="GreenVille logo" />
                    </span>
                </h1>
                <p className="px-0 mb-6 text-lg text-gray-600 md:text-xl lg:px-24">
                    At GreenVille, we believe in the beauty of nature. Our organic products are sustainably sourced to nourish your body, mind, and environment. Join us in creating a greener, healthier future with every purchase.
                </p>
                <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
                    <Link
                        className="inline-flex items-center justify-center w-full mb-2 p-3 px-4 mr-4 btn rounded-md btn-primary btn-lg sm:w-auto sm:mb-0 bg-[#8DC63F] text-white shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                        to="/products"
                    >
                        Shop Organic Now
                        <Iconify
                            icon="ep:right"
                            width={20}
                            height={20}
                            className="ml-2"
                        />
                    </Link>
                    <Link
                        className="inline-flex items-center justify-center w-full mb-2 p-3 px-4 rounded-md btn btn-light btn-lg sm:w-auto sm:mb-0 border border-green-600 text-[#8DC63F] shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                        to="/about"
                    >
                        Learn More

                    </Link>
                </div>
            </div>
        </section>
    )
};

