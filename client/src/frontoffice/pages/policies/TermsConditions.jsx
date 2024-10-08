import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../../components/MetaData";

const TermsAndConditions = () => {
    return (
        <>
            <MetaData title="Returns & Exchanges - GreenVille" />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

                <p className="mb-4">
                    Welcome to GreenVille! These terms and conditions outline the rules and
                    regulations for the use of our website.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">1. Introduction</h2>
                <p className="mb-4">
                    By accessing this website, we assume you accept these terms and
                    conditions. Do not continue to use GreenVille if you do not agree to all
                    of the terms and conditions stated on this page.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">
                    2. Intellectual Property Rights
                </h2>
                <p className="mb-4">
                    Unless otherwise stated, GreenVille and/or its licensors own the
                    intellectual property rights for all material on GreenVille. All
                    intellectual property rights are reserved. You may access this from
                    GreenVille for your own personal use subjected to restrictions set in
                    these terms and conditions.
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>You must not republish material from GreenVille</li>
                    <li>You must not sell, rent, or sub-license material from GreenVille</li>
                    <li>
                        You must not reproduce, duplicate, or copy material from GreenVille
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
                <p className="mb-4">
                    When you create an account with us, you must provide us with information
                    that is accurate, complete, and current at all times. Failure to do so
                    constitutes a breach of the terms, which may result in the immediate
                    termination of your account.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">
                    4. Limitation of Liability
                </h2>
                <p className="mb-4">
                    In no event shall GreenVille, nor any of its officers, directors, and
                    employees, be held liable for anything arising out of or in any way
                    connected with your use of this website.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">5. Links to Other Sites</h2>
                <p className="mb-4">
                    Our website may contain links to third-party websites or services that
                    are not owned or controlled by GreenVille. GreenVille has no control
                    over, and assumes no responsibility for, the content, privacy policies,
                    or practices of any third-party websites or services.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">
                    6. Changes to These Terms
                </h2>
                <p className="mb-4">
                    We reserve the right to amend or update these terms at any time without
                    prior notice. By continuing to use our website after such changes, you
                    agree to the updated terms.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">7. Governing Law</h2>
                <p className="mb-4">
                    These terms shall be governed and construed in accordance with the laws
                    of the country in which GreenVille operates, without regard to its
                    conflict of law provisions.
                </p>

                <p className="mb-4">
                    If you have any questions about these terms, please{" "}
                    <Link to="/contact" className="text-blue-600 underline">
                        Contact us
                    </Link>
                    .
                </p>
            </div>
        </>
    );
};

export default TermsAndConditions;
