import React, { Fragment, useState } from "react";
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
import createAxiosInstance from "../../../../utils/axiosConfig";

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
  const axiosInstance = createAxiosInstance("customer")

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

      const response = await axiosInstance.put(`/customers/${customerId}`, formData);
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
      <div className="flex bg-white py-6 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <ProfileLink />
          </div>
          <div className="md:col-span-3 bg-white shadow-lg rounded-lg p-8">
            <h4 className="text-xl font-bold mb-4">Update Profile</h4>
            <form
              className="space-y-4"
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <div className="space-y-2">
                <label htmlFor="first_name" className="block text-gray-700 font-medium">First Name</label>
                <input
                  id="first_name"
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="first_name"
                  placeholder="Your First Name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="last_name" className="block text-gray-700 font-medium">Last Name</label>
                <input
                  id="last_name"
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="last_name"
                  placeholder="Your Last Name"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                <input
                  id="email"
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                <input
                  id="password"
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Confirm Password</label>
                <input
                  id="confirmPassword"
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Avatar
                  className="h-12 w-12"
                  alt={`${customer.first_name} ${customer.last_name}`}
                  src={selectedImage ? URL.createObjectURL(selectedImage) : ""}
                />
                <div>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="fileInput">
                    <UploadButton onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 mb-4 py-3 bg-[#8DC63F] text-white flex justify-center rounded-lg text-md font-medium normal-case shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
              >
                Update
              </button>
            </form>
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
    </Fragment>
  );
};

export default UpdateProfile;
