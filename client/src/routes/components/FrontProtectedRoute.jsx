import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import FrontLayout from '../../frontoffice/pages/layout/Layout';
import Loader from '../../frontoffice/components/loader/Loader';

const FrontProtectedRoute = () => {
    const customerToken = localStorage.getItem('customer_access_token');

    const customerIsAuthenticated = Boolean(customerToken);

    if (customerIsAuthenticated) {
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
