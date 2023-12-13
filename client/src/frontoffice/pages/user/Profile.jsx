import React, { Fragment } from "react";
import ProfileLink from "../../components/profileLinks/ProfileLink";
import { useSelector } from "react-redux";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import styles from "./Profile.module.scss";
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
                          <Table responsive="sm md lg xl">
                            <tbody>
                              <tr>
                                <td>
                                  <Iconify
                                    icon="material-symbols-light:face"
                                    width={30}
                                    height={30}
                                  />
                                </td>
                                <td className="fw-bold">First Name</td>
                                <td>{customer?.first_name}</td>
                              </tr>
                              <tr>
                                <td>
                                  <Iconify
                                    icon="material-symbols-light:face-6"
                                    width={30}
                                    height={30}
                                  />
                                </td>
                                <td className="fw-bold">Last Name</td>
                                <td>{customer?.last_name}</td>
                              </tr>
                              <tr>
                                <td>
                                  <Iconify
                                    icon="material-symbols-light:mail-outline"
                                    width={30}
                                    height={30}
                                  />
                                </td>
                                <td className="fw-bold">Email</td>
                                <td>{customer?.email}</td>
                              </tr>
                            </tbody>
                          </Table>
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
