import React, { Fragment, useEffect } from "react";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "../../../../backoffice/components/iconify";
import { useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { clearErrors, getOrderDetails } from "../../../../redux/frontoffice/orderSlice";
import { Link } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const { loading, error, order = {} } = useSelector((state) => state.orderDetails);
    let status;

    if (order.orderStatus === "Processing") {
        status = 0;
    } else if (order.orderStatus === "On The Way") {
        status = 1;
    } else if (order.orderStatus === "Shipped") {
        status = 2;
    } else {
        status = 3;
    }

    let { id } = useParams();

    const statusClass = (index) => {
        if (index - status < 1) return "text-aqua";
        if (index - status === 1) return "animate-pulse opacity-100";
        if (index - status > 1) return "opacity-30";
    };

    const { shippingInfo, orderItems, paymentInfo, customer, totalPrice } = order;

    useEffect(() => {
        dispatch(getOrderDetails(id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, id]);

    const isPaid = paymentInfo && paymentInfo.status === "succeeded";

    return (
        <Fragment>
            <MetaData title={"Order Details"} />
            <Navbar />
            <div className="flex bg-white min-h-screen p-4">
                <div className="container mx-auto mt-5 mb-3">
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full md:w-1/4 px-3">
                            <ProfileLink />
                        </div>
                        <div className="w-full md:w-3/4 px-3">
                            <div className="bg-white shadow-lg rounded-lg p-4">
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between px-3 py-3">
                                            <h5 className="text-lg font-semibold">
                                                Order # {order._id}
                                            </h5>
                                            <button className="bg-[#F8ECC3] text-black py-2 px-4 rounded-full hover:bg-[#E4DCC2] transition duration-500">
                                                <Iconify
                                                    icon="mdi:download"
                                                    className="mr-2"
                                                />
                                                Invoice
                                            </button>
                                        </div>
                                        <hr />
                                        {/* order status  */}
                                        <div className="p-3">
                                            <h5 className="text-lg font-semibold">Order Status :</h5>
                                            <div className="flex flex-wrap -mx-3 mt-3 mb-3">
                                                <div className="w-1/4 px-3">
                                                    <div className="flex flex-col items-center">
                                                        <Iconify
                                                            icon="twemoji:hourglass"
                                                            className={`text-xl ${statusClass(0)}`}
                                                        />
                                                        <p className="mt-2">Processing</p>
                                                    </div>
                                                </div>
                                                <div className="w-1/4 px-3">
                                                    <div className="flex flex-col items-center">
                                                        <Iconify
                                                            icon="twemoji:truck"
                                                            className={`text-xl ${statusClass(1)}`}
                                                        />
                                                        <p className="mt-2">On The Way</p>
                                                    </div>
                                                </div>
                                                <div className="w-1/4 px-3">
                                                    <div className="flex flex-col items-center">
                                                        <Iconify
                                                            icon="twemoji:package"
                                                            className={`text-xl ${statusClass(2)}`}
                                                        />
                                                        <p className="mt-2">Shipped</p>
                                                    </div>
                                                </div>
                                                <div className="w-1/4 px-3">
                                                    <div className="flex flex-col items-center">
                                                        <Iconify
                                                            icon="twemoji:mailbox_closed"
                                                            className={`text-xl ${statusClass(3)}`}
                                                        />
                                                        <p className="mt-2">Delivery</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="text-primary" />
                                        <div className="flex flex-wrap -mx-3 p-3">
                                            {/* shipping info  */}
                                            <div className="w-full md:w-1/2 px-3">
                                                <h5 className="text-lg font-semibold">Shipping Info</h5>
                                                <table className="min-w-full divide-y divide-gray-200 border-0">
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="twemoji:blush" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">Name</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">{customer?.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="twemoji:telephone" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">Phone</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">{shippingInfo?.phoneNo}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="twemoji:round_pushpin" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">Address</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">{shippingInfo?.address}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="twemoji:cityscape" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">City</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">{shippingInfo?.city}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="w-full md:w-1/2 px-3">
                                                {/* payment info  */}
                                                <h5 className="text-lg font-semibold">Payment Info</h5>
                                                <table className="min-w-full divide-y divide-gray-200 border-0">
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="twemoji:dollar" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">Payment</Typography>
                                                            </td>
                                                            <td className={`px-4 py-2 font-semibold ${isPaid ? "text-green-500" : "text-red-500"}`}>
                                                                {isPaid ? "PAID" : "NOT PAID"}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="simple-icons:stripe" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">ID</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">{paymentInfo?.id}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="mdi:cash-multiple" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">Total</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">{totalPrice}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2">
                                                                <Iconify icon="twemoji:question" width={20} height={20} />
                                                            </td>
                                                            <td className="px-4 py-2 font-semibold">
                                                                <Typography variant="small">Status</Typography>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <Typography variant="small" className={isPaid ? "text-green-500" : "text-red-500"}>
                                                                    {isPaid ? "PAID" : "NOT PAID"}
                                                                </Typography>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <hr className="text-primary" />
                                        {/* items ordered  */}
                                        <div className="p-3">
                                            <h5 className="text-lg font-semibold">Items Ordered</h5>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Name</th>
                                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Quantity</th>
                                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Price</th>
                                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {orderItems?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.name}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                                                            <td className="px-4 py-2 text-sm text-gray-500">{item.price}</td>
                                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.price * item.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default OrderDetails;
