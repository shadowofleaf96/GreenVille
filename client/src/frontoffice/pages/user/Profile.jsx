import React, { Fragment } from "react";
import ProfileLink from "../../components/profileLinks/ProfileLink";
import { useSelector } from "react-redux";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import styles from "./Profile.module.scss";
import { Typography } from "@material-tailwind/react";
import Loader from "../../components/loader/Loader";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Profile = () => {
  const { customer, loading } = useSelector((state) => state.customers);
  return (
    <Fragment>
      <MetaData title={"Profile"} />
      <Navbar />
      <div className={styles.profile}>
        <div className="container mt-5 mb-3">
          <div className="row g-3">
            <div className="col-md-3">
              <ProfileLink />
            </div>
            <div className="col-md-9">
              {loading ? (
                <Loader />
              ) : (
                <>
                  <div className={styles.profile_container}>
                    <div className="d-flex align-items-center justify-content-between ps-3 pe-3 pt-3">
                      <h4>My Profile</h4>
                      <Link to="/me/update">
                        <Iconify
                          icon="material-symbols-light:edit"
                          size={20}
                          className="me-2"
                        />
                        Edit
                      </Link>
                    </div>
                    <hr className="text-primary" />
                    <div className="row g-3 p-3">
                      <div className="col-md-6">
                        <div className={styles.image}>
                          {customer && (
                            <img
                              src={`http://localhost:3000/${customer?.customer_image}`}
                              alt={
                                customer?.first_name + " " + customer?.last_name
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className={styles.info}>
                          <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-2">
                                  <Iconify icon="material-symbols-light:face" width={30} height={30} />
                                </td>
                                <td className="px-4 py-2 font-semibold">
                                  <Typography variant="small">First Name</Typography>
                                </td>
                                <td className="px-4 py-2">{customer?.first_name}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2">
                                  <Iconify icon="material-symbols-light:face-6" width={30} height={30} />
                                </td>
                                <td className="px-4 py-2 font-semibold">
                                  <Typography variant="small">Last Name</Typography>
                                </td>
                                <td className="px-4 py-2">{customer?.last_name}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2">
                                  <Iconify icon="material-symbols-light:mail-outline" width={30} height={30} />
                                </td>
                                <td className="px-4 py-2 font-semibold">
                                  <Typography variant="small">Email</Typography>
                                </td>
                                <td className="px-4 py-2">{customer?.email}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Profile;
