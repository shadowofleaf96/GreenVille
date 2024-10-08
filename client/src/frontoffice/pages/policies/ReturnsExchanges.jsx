import React from "react";
import MetaData from "../../components/MetaData";

const ReturnsAndExchanges = () => {
    return (
        <>
            <MetaData title="Returns & Exchanges - GreenVille" />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center">Returns and Exchanges</h1>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Return Policy</h2>
                    <p className="text-gray-700 mb-2">
                        At GreenVille, we want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, you may return it within 30 days of receipt for a full refund or exchange.
                    </p>
                    <p className="text-gray-700 mb-2">
                        To be eligible for a return, items must be in their original condition, unopened, and with all original packaging intact.
                    </p>
                    <p className="text-gray-700 mb-2">
                        Please note that certain items, such as perishable goods, cannot be returned.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">How to Return an Item</h2>
                    <ol className="list-decimal list-inside text-gray-700">
                        <li className="mb-2">Contact our customer service team at <a href="mailto:support@greenville.com" className="text-blue-600">support@greenville.com</a> to initiate the return process.</li>
                        <li className="mb-2">Provide your order number and the reason for the return.</li>
                        <li className="mb-2">We will send you a return shipping label and instructions.</li>
                        <li className="mb-2">Pack the item securely and attach the shipping label.</li>
                        <li className="mb-2">Ship the package to the address provided by our customer service team.</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Exchanges</h2>
                    <p className="text-gray-700 mb-2">
                        If you would like to exchange an item for a different size or color, please follow the same steps as the return process. Once we receive your returned item, we will process your exchange and send the new item to you.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
                    <h3 className="font-semibold">1. How long does it take to process a return?</h3>
                    <p className="text-gray-700 mb-4">Returns are typically processed within 5-7 business days of receiving your package.</p>

                    <h3 className="font-semibold">2. Will I be refunded the original shipping costs?</h3>
                    <p className="text-gray-700 mb-4">Unfortunately, we cannot refund the original shipping costs unless the return is due to an error on our part.</p>

                    <h3 className="font-semibold">3. What if I received a damaged or defective item?</h3>
                    <p className="text-gray-700 mb-4">If you receive a damaged or defective item, please contact us immediately at <a href="mailto:support@greenville.com" className="text-blue-600">support@greenville.com</a> for assistance.</p>
                </div>

                <div className="text-center">
                    <p className="text-gray-700">
                        Thank you for shopping with us! We appreciate your support for organic products.
                    </p>
                </div>
            </div>
        </>
    );
};

export default ReturnsAndExchanges;
