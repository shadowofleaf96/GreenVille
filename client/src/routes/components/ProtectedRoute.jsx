import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardLayout from '../../backoffice/layouts/dashboard';
import Loader from '../../frontoffice/components/loader/Loader';

const ProtectedRoute = () => {
    const userToken = localStorage.getItem('user_access_token');

    const userIsAuthenticated = Boolean(userToken);

    if (userIsAuthenticated) {
        return (
            <DashboardLayout>
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </DashboardLayout>
        );
    } else {
        return <Navigate to="/admin/login" />;
    }
};

export default ProtectedRoute;
