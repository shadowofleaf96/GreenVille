import { Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import FrontLayout from '../../frontoffice/pages/layout/Layout';
import Loader from '../../frontoffice/components/loader/Loader';
import { toast } from 'react-toastify';
import createAxiosInstance from "../../utils/axiosConfig";

const FrontProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const customerToken = localStorage.getItem('customer_access_token');

    const fetchCustomerData = async () => {
        if (customerToken) {
            try {
                const axiosInstance = createAxiosInstance("customer");
                const { status } = await axiosInstance.get("/customers/profile");

                if (status >= 200 && status < 300) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("customer_access_token");
                    setIsAuthenticated(false);
                    toast.error("Session expired! Please log in again.");
                }
            } catch (err) {
                localStorage.removeItem("customer_access_token");
                setIsAuthenticated(false);
                toast.error("Failed to fetch customer data!");
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [customerToken]);

    if (isAuthenticated === null) {
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
        return <Navigate to="/login" />;
    }
};

export default FrontProtectedRoute;
