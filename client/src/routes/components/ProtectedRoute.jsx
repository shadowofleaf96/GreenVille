import { Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardLayout from '../../backoffice/layouts/dashboard';
import Loader from '../../frontoffice/components/loader/Loader';
import { toast } from 'react-toastify';
import createAxiosInstance from "../../utils/axiosConfig";

const ProtectedRoute = () => {
    const userToken = localStorage.getItem('user_access_token');
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchUserData = async () => {
        if (userToken) {
            try {
                const axiosInstance = createAxiosInstance("admin");
                const { status } = await axiosInstance.get("/users/profile");
                if (status >= 200 && status < 300) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error(err);
                toast.error("Session expired, please log in again!");
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false); 
        }
        setLoading(false); 
    };

    useEffect(() => {
        fetchUserData();
    }, [userToken]);

    if (loading) {
        return <Loader />;
    }

    if (isAuthenticated) {
        return (
            <DashboardLayout>
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </DashboardLayout>
        );
    } else {
        return <Navigate to="/admin/login" replace />;
    }
};

export default ProtectedRoute;
