import React, { Fragment, useEffect, useState } from "react";
import Loader from "../../../components/loader/Loader";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, myOrdersList } from "../../../../redux/frontoffice/orderSlice";
import Navbar from "../../../components/header/Navbar";
import Iconify from "../../../../backoffice/components/iconify";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const MyOrders = () => {
    const dispatch = useDispatch();
    const { customer } = useSelector((state) => state.customers);
    const { loading, error, orders } = useSelector((state) => state.orders.myOrdersList);
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {
        if (customer && customer._id) {
            dispatch(myOrdersList(customer._id));
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, customer, error]);

    const toggleOrderDetails = (orderId) => {
        setActiveOrder((prev) => (prev === orderId ? null : orderId));
    };

    return (
        <Fragment>
            <MetaData title={"My Orders"} />
            <Navbar />
            <div className="min-h-screen bg-gray-100 py-10">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <ProfileLink />
                    </div>

                    <div className="md:col-span-3 place-content-center bg-white shadow-lg rounded-lg p-6">
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                {orders && (
                                    <Fragment>
                                        <div className="p-6 bg-white shadow-sm rounded-lg">
                                            {orders.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <Iconify className="mb-2" icon="mdi:cart" width={100} height={100} />
                                                    <h4 className="text-2xl font-semibold mb-4 text-gray-800">
                                                        You Haven't Placed Any Orders Yet
                                                    </h4>
                                                    <p className="text-gray-600 mb-6">
                                                        Looks like you haven't made any purchases yet. Browse our products and find something you like!
                                                    </p>
                                                    <Link
                                                        to="/products"
                                                        className="px-6 py-3 bg-[#8DC63F] text-white font-medium rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                                                    >
                                                        Start Shopping
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto space-y-6">
                                                    {orders.map((order) => (
                                                        <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                                            <div className="grid grid-cols-12 items-center border-b pb-3 mb-4">
                                                                <div
                                                                    className="col-span-1 cursor-pointer"
                                                                    onClick={() => toggleOrderDetails(order._id)}
                                                                >
                                                                    <Iconify
                                                                        icon={activeOrder === order._id ? "mdi:chevron-down" : "mdi:chevron-right"}
                                                                        width={24}
                                                                        height={24}
                                                                        className="text-gray-600"
                                                                    />
                                                                </div>

                                                                <div className="col-span-7">
                                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                                        Order ID: <span className="text-gray-600">{order._id}</span>
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        Date: {new Date(order.order_date).toLocaleDateString()}
                                                                    </p>
                                                                </div>

                                                                <div className="col-span-4 text-right">
                                                                    <p className={`inline-block px-3 py-1 rounded-md text-sm font-medium capitalize ${order.status === "delivered"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : order.status === "processing"
                                                                            ? "bg-yellow-100 text-yellow-600"
                                                                            : order.status === "shipped"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : order.status === "canceled"
                                                                                    ? "bg-red-100 text-red-600"
                                                                                    : "bg-gray-100 text-gray-600"
                                                                        }`}>
                                                                        {order.status}
                                                                    </p>
                                                                    <p className="font-semibold text-gray-700 mt-1">
                                                                        Total: {order.cart_total_price} DH
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {activeOrder === order._id && (
                                                                <div className="space-y-3 mt-3">
                                                                    {order.order_items.map((item) => (
                                                                        <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                                                                            <img className="w-12 h-12 object-contain" src={`http://localhost:3000/${item.product.product_image}`} alt="ProductImg" />
                                                                            <p className="text-gray-700 font-medium">{item.product.product_name}</p>
                                                                            <p className="text-gray-500">x{item.quantity}</p>
                                                                            <p className="font-semibold text-gray-700">{item.price} DH</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Fragment>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment >
    );
};

export default MyOrders;
