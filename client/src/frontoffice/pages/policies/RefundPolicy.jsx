import React from 'react';
import MetaData from "../../components/MetaData";

const RefundPolicy = () => {
    return (
        <div>
            <MetaData title="Refund Policy" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Refund Policy</h1>

                <p className="mb-4">
                    At GreenVille, we strive to ensure your complete satisfaction with your purchase. If for any reason you are not satisfied with your order, we are here to help.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Eligibility for Refunds</h2>
                <p className="mb-4">
                    To be eligible for a refund, you must meet the following criteria:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>The item must be unused and in the same condition that you received it.</li>
                    <li>It must be in the original packaging.</li>
                    <li>You must provide a receipt or proof of purchase.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Non-Refundable Items</h2>
                <p className="mb-4">
                    Certain items are non-refundable, including:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Gift cards</li>
                    <li>Downloadable software products</li>
                    <li>Some health and personal care items</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">How to Request a Refund</h2>
                <p className="mb-4">
                    To initiate a refund, please contact our customer service team at <a href="mailto:support@greenville.com" className="text-blue-500 underline">support@greenville.com</a> within 30 days of receiving your order. Include the following information in your request:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Your order number</li>
                    <li>A brief description of the reason for the refund</li>
                    <li>Your contact information</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Processing Refunds</h2>
                <p className="mb-4">
                    Once your refund request is received, we will inspect the item and notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Shipping Costs</h2>
                <p className="mb-4">
                    Please note that shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about our refund policy, please contact us:
                </p>
                <p className="mb-4">
                    Email: <a href="mailto:support@greenville.com" className="text-blue-500 underline">support@greenville.com</a>
                </p>

                <p className="mb-4">
                    Thank you for shopping with us!
                </p>
            </div>
        </div>
    );
};

export default RefundPolicy;
