import React from "react";
import Iconify from "../../../../backoffice/components/iconify";

const Benefits = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 sm:px-2 lg:px-4">
        <div className="max-w-2xl mx-auto px-4 grid grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-3">
          
          <div className="text-center sm:flex sm:text-left lg:block lg:text-center">
            <div className="sm:flex-shrink-0">
              <div className="flow-root">
                <Iconify
                  icon="fa-solid:shipping-fast"
                  className="w-auto h-auto mx-auto text-green-500 text-2xl cursor-pointer rounded-md hover:text-yellow-400"
                  width={60}
                  height={60}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0">
              <h3 className="text-lg font-semibold text-gray-900">Fast and Reliable Delivery</h3>
              <p className="mt-2 text-sm text-gray-500">
                Enjoy speedy and dependable delivery services right to your doorstep. Your orders are our priority.
              </p>
            </div>
          </div>

          <div className="text-center sm:flex sm:text-left lg:block lg:text-center">
            <div className="sm:flex-shrink-0">
              <div className="flow-root">
                <Iconify
                  icon="bx:support"
                  className="w-auto h-auto mx-auto text-green-500 text-2xl cursor-pointer rounded-md hover:text-yellow-400"
                  width={60}
                  height={60}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0">
              <h3 className="text-lg font-semibold text-gray-900">24/7 Dedicated Customer Support</h3>
              <p className="mt-2 text-sm text-gray-500">
                Our support team is available around the clock to assist you with any queries or issues, ensuring a smooth shopping experience.
              </p>
            </div>
          </div>

          <div className="text-center sm:flex sm:text-left lg:block lg:text-center">
            <div className="sm:flex-shrink-0">
              <div className="flow-root">
                <Iconify
                  icon="wpf:worldwide-location"
                  className="w-auto h-auto mx-auto text-green-500 text-2xl cursor-pointer rounded-md hover:text-yellow-400"
                  width={60}
                  height={60}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0">
              <h3 className="text-lg font-semibold text-gray-900">Nationwide Shipping Across Morocco</h3>
              <p className="mt-2 text-sm text-gray-500">
                We deliver to all corners of Morocco. Wherever you are, we’ve got you covered with our efficient delivery network.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Benefits;
