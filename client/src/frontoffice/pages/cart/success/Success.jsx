import React, { Fragment } from "react";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/header/Navbar";
import MetaData from "../../../components/MetaData";
import { Icon } from "@material-tailwind/react";

const Success = () => {
    return (
        <Fragment>
            <MetaData title={"Success"} />
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen pt-12">
                <div className="relative flex items-center justify-center w-full max-w-md">
                    <svg
                        className="w-24 h-24 absolute"
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
            </div>
            <Footer />
        </Fragment>
    );
};

export default Success;
