import React from 'react';
import Logo from '../../../../backoffice/components/logo';

const CheckYourEmailPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
            <h1 className="text-2xl font-bold text-[#8DC63F]">Check Your Email</h1>
            <p className="text-lg mt-4 text-gray-600">
                Thank you for registering! Please check your email for a validation link
                to activate your account.
            </p>
            <p className="text-sm text-gray-500 mt-2">
                If you don’t see the email, check your spam folder or contact our support team for help.
            </p>
        </div>
    );
};

export default CheckYourEmailPage;
