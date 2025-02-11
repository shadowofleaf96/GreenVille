import { Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import FrontLayout from '../../frontoffice/pages/layout/Layout';
import Loader from '../../frontoffice/components/loader/Loader';
import { toast } from 'react-toastify';
import createAxiosInstance from "../../utils/axiosConfig";
import { useTranslation } from 'react-i18next';

const FrontProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const customerToken = localStorage.getItem('customer_access_token');
    const { t } = useTranslation();

    const fetchCustomerData = async () => {
        try {
            if (!customerToken) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const axiosInstance = createAxiosInstance("customer");
            const { status } = await axiosInstance.get("/customers/profile");

            if (status >= 200 && status < 300) {
                setIsAuthenticated(true);
            } else {
                throw new Error("Invalid status");
            }
        } catch (err) {
            console.error(err);
            toast.error(t("Session expired, please log in again!"));
            localStorage.removeItem("customer_access_token");
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCustomerData();
    }, [customerToken]);

    if (loading) {
        return <Loader />;
    }

    if (isAuthenticated) {
        return (
            <FrontLayout>
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </FrontLayout>
        );
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default FrontProtectedRoute;
