import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../components/footer/Footer";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Navbar from "../../../components/header/Navbar";
import ButtonLoader from "../../../components/loader/ButtonLoader";
import MetaData from "../../../components/MetaData";
import { useRouter } from "../../../../routes/hooks";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import UploadButton from "../../../../backoffice/components/button/UploadButton";
import styles from "./UpdateProfile.module.scss";

const UpdateProfile = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

  const { customer } = useSelector((state) => state.customers);

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    console.log("Selected Image:", file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const editedCustomer = {
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
    };

    try {
      await handleSaveEditedCustomer(
        customer._id,
        editedCustomer,
        selectedImage
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditedCustomer = async (
    customerId,
    editedCustomer,
    selectedImage
  ) => {
    try {
      const formData = new FormData();
      formData.append("first_name", editedCustomer.first_name);
      formData.append("last_name", editedCustomer.last_name);
      formData.append("email", editedCustomer.email);
      formData.append("password", editedCustomer.password);
      if (selectedImage) {
        formData.append("customer_image", selectedImage);
      }

      const response = await axios.put(`/v1/customers/${customerId}`, formData);
      openSnackbar(response.data.message);
      router.push("/me");
    } catch (error) {
      openSnackbar("Error: " + error.response.data.message);
      console.error(error);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Update Profile"} />
      <Navbar />
      <div className={styles.update_profile}>
        <div className="container mt-5 mb-3">
          <div className="row g-3">
            <div className="col-md-3">
              <ProfileLink />
            </div>
            <div className="col-md-9">
              <div className={styles.form_container}>
                <h4 className="text-center mt-3">
                  Update Profile
                  <form
                    className={styles.form}
                    onSubmit={submitHandler}
                    encType="multipart/form-data"
                  >
                    <div className={styles.from_group}>
                      <label htmlFor="email_field">First Name</label>
                      <input
                        className="from_input"
                        name="first_name"
                        placeholder="Your First Name"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                      />
                    </div>

                    <div className={styles.from_group}>
                      <label htmlFor="email_field">Last Name</label>
                      <input
                        className="from_input"
                        name="last_name"
                        placeholder="Your Last Name"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                      />
                    </div>
                    <div className={styles.from_group}>
                      <label htmlFor="email_field">Email</label>
                      <input
                        className="from_input"
                        name="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                    </div>

                    <div className={styles.from_group}>
                      <label htmlFor="password_field">Password</label>
                      <input
                        className="from_input"
                        name="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                      />
                    </div>

                    <div className={styles.from_group}>
                      <label htmlFor="confirm_password_field">
                        Confirm Password
                      </label>
                      <input
                        className="from_input"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                      />
                    </div>
                    <div className={styles.from_group}>
                      <div className="d-flex align-items-center">
                        <div className="mt-3">
                          <Avatar
                            style={{
                              height: "50px",
                              width: "50px",
                            }}
                            alt={`${customer.first_name} ${customer.last_name}`}
                            src={
                              selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : ""
                            }
                          />
                        </div>
                        <div className={styles.from_group}>
                          <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <label htmlFor="fileInput">
                            <UploadButton onChange={handleImageChange} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className={styles.from_group}>
                      <button>{"Update"}</button>
                    </div>
                  </form>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </Fragment>
  );
};

export default UpdateProfile;
