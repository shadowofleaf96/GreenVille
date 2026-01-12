import React from "react";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Site Under Maintenance
          </h2>
          <p className="mt-2 text-md text-gray-600">
            We are currently setting up the store to bring you the best
            experience. Please check back soon.
          </p>
        </div>
        <div className="mt-8">
          <div className="animate-pulse flex justify-center">
            <div className="rounded-full bg-slate-200 h-16 w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
