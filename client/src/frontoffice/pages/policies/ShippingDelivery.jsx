import React from 'react';
import MetaData from '../../components/MetaData';

const ShippingAndDeliveryPolicy = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <MetaData title="Returns & Exchanges - GreenVille" />
            <h1 className="text-3xl font-bold text-center mb-6">Shipping and Delivery Policy</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
                <p className="text-gray-700 mb-4">
                    At GreenVille, we are committed to delivering your organic products in a timely and efficient manner.
                    We offer shipping across Morocco and aim to process and ship your orders as quickly as possible.
                </p>
                <p className="text-gray-700 mb-4">
                    Orders are typically processed within 1-2 business days, and you will receive a notification with tracking information once your order has shipped.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Delivery Times</h2>
                <p className="text-gray-700 mb-4">
                    Delivery times may vary based on your location. Generally, you can expect your order to arrive within
                    3-7 business days after it has been processed.
                </p>
                <p className="text-gray-700 mb-4">
                    Please note that during peak seasons or holidays, delivery times may be extended.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Shipping Rates</h2>
                <p className="text-gray-700 mb-4">
                    Shipping costs are calculated at checkout based on the weight and dimensions of your order, as well as
                    the delivery location. We strive to offer the most affordable shipping rates while ensuring your products
                    arrive safely.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
                <p className="text-gray-700 mb-4">
                    Once your order has been shipped, you will receive a tracking number via email, allowing you to monitor the
                    status of your shipment. You can also track your order on our website under the "Order Tracking" section.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
                <p className="text-gray-700 mb-4">
                    Currently, we only offer shipping within Morocco. However, we are working towards expanding our services
                    internationally in the near future. Stay tuned for updates!
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                    If you have any questions regarding our shipping and delivery policies, please feel free to contact our customer service team
                    at <a href="mailto:support@greenville.com" className="text-blue-600 underline">support@greenville.com</a> or call us at +212 123 456 789.
                </p>
            </section>

            <p className="text-gray-700 text-center">
                Thank you for choosing GreenVille! We appreciate your support for organic products and are dedicated to providing you with the best shopping experience.
            </p>
        </div>
    );
};

export default ShippingAndDeliveryPolicy;
