import React, { Fragment } from "react";
import ProfileLink from "../../components/profileLinks/ProfileLink";
import { useSelector } from "react-redux";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
const backend = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { customer, loading } = useSelector((state) => state.customers);

  return (
    <Fragment>
      <MetaData title={"Profile"} />
      <div className="flex bg-white">
        <div className="container mx-auto mt-5 mb-3 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <ProfileLink />
            </div>
            <div className="md:col-span-3">
              {loading ? (
                <Loader />
              ) : (
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold">My Profile</h4>
                    <Link
                      to="/me/update"
                      className="flex items-center bg-[#f2effe] text-[#8DC63F] px-4 py-2 rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                    >
                      <Iconify
                        icon="material-symbols-light:edit"
                        size={20}
                        className="mr-2"
                      />
                      Edit
                    </Link>
                  </div>
                  <hr className="border-primary mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-center mb-4 md:mb-0">
                      {customer && (
                        <img
                          src={`${backend}/${customer?.customer_image}`}
                          alt={`${customer?.first_name} ${customer?.last_name}`}
                          className="h-64 w-64 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex items-center">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-gray-600">
                              <Iconify icon="material-symbols-light:face" width={30} height={30} />
                            </td>
                            <td className="px-4 py-2 font-semibold text-gray-600">
                              <p variant="small">First Name</p>
                            </td>
                            <td className="px-4 py-2">{customer?.first_name}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-gray-600">
                              <Iconify icon="material-symbols-light:face-6" width={30} height={30} />
                            </td>
                            <td className="px-4 py-2 font-semibold text-gray-600">
                              <p variant="small">Last Name</p>
                            </td>
                            <td className="px-4 py-2">{customer?.last_name}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-gray-600">
                              <Iconify icon="material-symbols-light:mail-outline" width={30} height={30} />
                            </td>
                            <td className="px-4 py-2 font-semibold text-gray-600">
                              <p variant="small">Email</p>
                            </td>
                            <td className="px-4 py-2">{customer?.email}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
