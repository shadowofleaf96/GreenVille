import React, { Fragment, useEffect } from "react";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "../../../../backoffice/components/iconify";
import { useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import styles from "./OrderDetails.module.scss";
import { clearErrors, getOrderDetails } from "../../../../redux/frontoffice/orderSlice";
import { Link } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import MetaData from "../../../components/MetaData";

const OrderDetails = () => {
    const dispatch = useDispatch();

    const {
        loading,
        error,
        order = {},
    } = useSelector((state) => state.orderDetails);

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
        if (index - status < 1) return styles.done;
        if (index - status === 1) return styles.inProgress;
        if (index - status > 1) return styles.undone;
    };

    const { shippingInfo, orderItems, paymentInfo, customer, totalPrice } = order;

    useEffect(() => {
        dispatch(getOrderDetails(id));

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, id]);

    const isPaid =
        paymentInfo && paymentInfo.status === "succeeded" ? true : false;
    return (
        <Fragment>
            <MetaData title={"Order Details"} />
            <Navbar />
            <div className={styles.order_details}>
                <div className="container mt-5 mb-3">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <ProfileLink />
                        </div>
                        <div className="col-md-9">
                            <div className={styles.details}>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between ps-3 pe-3 pt-3">
                                            <h5 className="">
                                                Order # {order._id}
                                            </h5>
                                            <button>
                                                <Iconify
                                                    icon="mdi:download"
                                                    className={styles.icon}
                                                />{" "}
                                                Invoice
                                            </button>
                                        </div>
                                        <hr />
                                        {/* order status  */}
                                        <div className="p-3">
                                            <h5>Order Status :</h5>
                                            <div className="row g-3 mt-3 mb-3">
                                                <div className="col-md-3">
                                                    <div className="d-flex align-items-center justify-content-center flex-column">
                                                        <Iconify
                                                            icon="twemoji:hourglass"
                                                            className={statusClass(
                                                                0
                                                            )}
                                                            size={40}
                                                        />
                                                        <p className="mt-2">
                                                            Processing
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="d-flex align-items-center justify-content-center flex-column">
                                                        <Iconify
                                                            icon="twemoji:truck"
                                                            className={statusClass(
                                                                1
                                                            )}
                                                            size={40}
                                                        />
                                                        <p className="mt-2">
                                                            On The Way
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="d-flex align-items-center justify-content-center flex-column">
                                                        <Iconify
                                                            icon="twemoji:package"
                                                            className={statusClass(
                                                                2
                                                            )}
                                                            size={40}
                                                        />
                                                        <p className="mt-2">
                                                            Shipped
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="d-flex align-items-center justify-content-center flex-column">
                                                        <Iconify
                                                            icon="twemoji:mailbox_closed"
                                                            className={statusClass(
                                                                3
                                                            )}
                                                            size={40}
                                                        />
                                                        <p className="mt-2">
                                                            Delivery
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="text-primary" />
                                        <div className="row p-3">
                                            {/* shipping info  */}
                                            <div className="col-md-6">
                                                <h5>Shipping Info</h5>
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
                                            <div className="col-md-6">
                                                {/* payment info  */}
                                                <h5>Payment Info</h5>
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
                                                            <td className="px-4 py-2">{order?.orderStatus}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <hr className="text-primary" />

                                        {/* order items  */}
                                        <div className="p-3">
                                            <h5>Order Items</h5>
                                            {orderItems &&
                                                orderItems.map((item) => (
                                                    <div
                                                        key={item.product}
                                                        className="row my-5"
                                                    >
                                                        <div className="col-4 col-lg-2">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                height="45"
                                                                width="65"
                                                            />
                                                        </div>

                                                        <div className="col-5 col-lg-5">
                                                            <Link
                                                                style={{
                                                                    textDecoration:
                                                                        "none",
                                                                }}
                                                                to={`/products/${item.product}`}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </div>

                                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                            <p>${item.price}</p>
                                                        </div>

                                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                            <p>
                                                                {item.quantity}{" "}
                                                                Piece(s)
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
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
