import React, { Fragment, useEffect, useState } from "react";
import Loader from "../../../components/loader/Loader";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../../components/MetaData";
import { useTranslation } from "react-i18next";
import Review from "../../review/Review";
import LoadingButton from "@mui/lab/LoadingButton";

const backend = import.meta.env.VITE_BACKEND_URL;

const MyProfile = () => {
    const { t, i18n } = useTranslation();

    const { customer, loading } = useSelector((state) => state.customers);

    return (
        <Fragment>
            <MetaData title={t("title")} />
            <div className="min-h-screen bg-gray-100 py-10">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <ProfileLink />
                    </div>

                    <div className="md:col-span-3 place-content-center bg-white shadow-lg rounded-lg p-2 md:p-6">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t("customerInformation")}</h2>
                                    <div className="space-y-2 flex-grow">
                                        <p className="text-gray-600"><strong className="font-medium text-gray-700">{t("name")}:</strong> {customer?.first_name} {customer?.last_name}</p>
                                        <p className="text-gray-600"><strong className="font-medium text-gray-700">{t("email")}:</strong> {customer?.email}</p>
                                        <p className="text-gray-600"><strong className="font-medium text-gray-700">{t("phoneNo")}:</strong> {customer?.shipping_address.phone_no}</p>
                                    </div>
                                    <Link to={`/profile/updateprofile`} className="mt-4">
                                        <LoadingButton
                                            type="submit"
                                            fullWidth
                                            loading={loading}
                                            variant="contained"
                                            sx={{ fontWeight: 500, fontSize: 15 }}
                                            className="bg-[#8DC63F] text-white rounded-md text-sm px-6 py-2"
                                            loadingPosition="center"
                                        >
                                            {loading ? t("updating") : t("updateCustomer")}
                                        </LoadingButton>
                                    </Link>
                                </div>

                                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t("shippingAddress")}</h2>
                                    <div className="space-y-2 flex-grow">
                                        <p className="text-gray-600"><strong className="font-medium text-gray-700">{t("street")}:</strong> {customer?.shipping_address.street}</p>
                                        <p className="text-gray-600"><strong className="font-medium text-gray-700">{t("city")}:</strong> {customer?.shipping_address.city}</p>
                                        <p className="text-gray-600"><strong className="font-medium text-gray-700">{t("postalCode")}:</strong> {customer?.shipping_address.postal_code}</p>
                                    </div>
                                    <Link to={`/profile/updateaddress`} className="mt-4">
                                        <LoadingButton
                                            type="submit"
                                            fullWidth
                                            loading={loading}
                                            variant="contained"
                                            sx={{ fontWeight: 500, fontSize: 15 }}
                                            className="bg-[#8DC63F] text-white rounded-md text-sm px-6 py-2"
                                            loadingPosition="center"
                                        >
                                            {loading ? t("updating") : t("updateShippingAddress")}
                                        </LoadingButton>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MyProfile;
