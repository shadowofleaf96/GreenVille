import React, { Fragment, useEffect } from "react";
import Loader from "../../../components/loader/Loader";
import ProfileLink from "../../../components/profileLinks/ProfileLink";

import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, myOrders } from "../../../../redux/frontoffice/orderSlice";
import { Link } from "react-router-dom";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const MyOrders = () => {
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(myOrders());

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    return (
        <Fragment>
            <MetaData title={"My Orders"} />
            <Navbar />
            <div className="flex flex-col bg-white min-h-screen py-5">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3">
                        <div className="w-full md:w-1/4">
                            <ProfileLink />
                        </div>
                        <div className="w-full md:w-3/4">
                            {loading ? (
                                <Loader />
                            ) : (
                                <>
                                    {orders && (
                                        <Fragment>
                                            <div className="bg-white shadow-md p-4 rounded-lg">
                                                {orders.length === 0 ? (
                                                    <h4 className="text-center text-lg font-semibold">No Item Order Yet</h4>
                                                ) : (
                                                    <>
                                                        <div className="overflow-x-auto">
                                                            <div className="flex flex-wrap gap-4 mb-4">
                                                                <div className="w-1/5 font-semibold">Order ID</div>
                                                                <div className="w-1/5 font-semibold">Quantity</div>
                                                                <div className="w-1/5 font-semibold">Amount</div>
                                                                <div className="w-1/5 font-semibold">Status</div>
                                                                <div className="w-1/5 font-semibold">Actions</div>
                                                            </div>
                                                            <hr className="my-4 border-primary" />
                                                            {orders.map((order) => (
                                                                <div key={order._id} className="flex flex-wrap gap-4 mb-2">
                                                                    <div className="w-1/5">{order._id}</div>
                                                                    <div className="w-1/5">{order.orderItems.length}</div>
                                                                    <div className="w-1/5">${order.totalPrice}</div>
                                                                    <div className="w-1/5">
                                                                        {order.orderStatus === "Delivered" && (
                                                                            <p className="text-green-500">{order.orderStatus}</p>
                                                                        )}
                                                                        {order.orderStatus === "Shipped" && (
                                                                            <p className="text-sky-500">{order.orderStatus}</p>
                                                                        )}
                                                                        {order.orderStatus === "On The Way" && (
                                                                            <p className="text-yellow-500">{order.orderStatus}</p>
                                                                        )}
                                                                        {order.orderStatus === "Processing" && (
                                                                            <p className="text-yellow-500">{order.orderStatus}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="w-1/5">
                                                                        <Link
                                                                            to={`/order/${order._id}`}
                                                                            className="inline-block bg-gray-200 text-blue-600 py-2 px-4 rounded-full hover:bg-gray-300 transition duration-300"
                                                                        >
                                                                            View
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Fragment>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default MyOrders;
