import { Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import FrontLayout from '../../frontoffice/pages/layout/Layout';
import Loader from '../../frontoffice/components/loader/Loader';
import { toast } from 'react-toastify';
import createAxiosInstance from "../../utils/axiosConfig";

const FrontProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const customerToken = localStorage.getItem('customer_access_token');

    const fetchCustomerData = async () => {
        if (customerToken) {
            try {
                const axiosInstance = createAxiosInstance("customer");
                const { status } = await axiosInstance.get("/customers/profile");
                if (status >= 200 && status < 300) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch customer data!");
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
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
