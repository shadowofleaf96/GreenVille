import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import MetaData from "../../../components/MetaData";
import { useRouter } from "../../../../routes/hooks";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import UploadButton from "../../../../backoffice/components/button/UploadButton";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";

const UpdateProfile = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const { customer } = useSelector((state) => state.customers);
  const axiosInstance = createAxiosInstance("customer")

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
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
    setLoading(true);
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
      setLoading(false);
      toast.success(response.data.message);
      router.push("/me");
    } catch (error) {
      setLoading(false);
      toast.error("Error: " + error.response.data.message);
      console.error(error);
    }
  };

  return (
    <Fragment>
      <MetaData title={"Update Profile"} />
      <div className="flex flex-col bg-white py-6 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 mb-4 md:mb-0">
            <ProfileLink />
          </div>
          <div className="md:col-span-3 bg-white shadow-lg rounded-lg p-6 md:p-8">
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

              <LoadingButton
                type="submit"
                fullWidth
                loading={loading}
                variant="contained"
                sx={{ fontWeight: 500, fontSize: 15 }}
                className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2"
                loadingPosition="center"
              >
                {loading ? 'Updating...' : 'Update'}
              </LoadingButton>

            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
