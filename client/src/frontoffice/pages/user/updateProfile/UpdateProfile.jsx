import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import MetaData from "../../../components/MetaData";
import { useRouter } from "../../../../routes/hooks";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import UploadButton from "../../../../backoffice/components/button/UploadButton";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { fetchCustomerProfile } from "../../../../redux/frontoffice/customerSlice";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { customer } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const axiosInstance = createAxiosInstance("customer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const onSubmit = async (data) => {
    const editedCustomer = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
    };

    try {
      await handleSaveEditedCustomer(customer._id, editedCustomer, selectedImage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditedCustomer = async (customerId, editedCustomer, selectedImage) => {
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
      dispatch(fetchCustomerProfile(customerId));
      setLoading(false);
      toast.success(t(response.data.message));
    } catch (error) {
      setLoading(false);
      toast.error("Error: " + (t(error.response.data.message)));
    }
  };

  return (
    <Fragment>
      <MetaData title={t("Update Profile")} />
      <div className="flex flex-col bg-white py-6 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
          <div className="md:col-span-1 mb-4 md:mb-0">
            <ProfileLink />
          </div>
          <div className="md:col-span-3 bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h4 className="text-xl font-bold mb-4">{t("Update Profile")}</h4>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="space-y-2">
                <label htmlFor="first_name" className="block text-gray-700 font-medium">{t("First Name")}</label>
                <input
                  id="first_name"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-500' : ''}`}
                  {...register("first_name", { required: t("FirstNameRequired") })}
                  placeholder={t("Your First Name")}
                  type="text"
                />
                {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="last_name" className="block text-gray-700 font-medium">{t("Last Name")}</label>
                <input
                  id="last_name"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-500' : ''}`}
                  {...register("last_name", { required: t("LastNameRequired") })}
                  placeholder={t("Your Last Name")}
                  type="text"
                />
                {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 font-medium">{t("Email")}</label>
                <input
                  id="email"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  {...register("email", {
                    required: t("EmailRequired"),
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: t("EmailInvalid")
                    }
                  })}
                  placeholder={t("Your Email")}
                  type="email"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">{t("Password")}</label>
                <input
                  id="password"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  {...register("password", {
                    required: t("PasswordRequired"),
                    minLength: {
                      value: 6,
                      message: t("PasswordMinLength")
                    }
                  })}
                  placeholder={t("Your Password")}
                  type="password"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">{t("Confirm Password")}</label>
                <input
                  id="confirmPassword"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  {...register("confirmPassword", {
                    required: t("ConfirmPasswordRequired"),
                    validate: (value) => {
                      const { password } = getValues();
                      return value === password || t("PasswordsDoNotMatch");
                    },
                  })}
                  placeholder={t("Confirm Password")}
                  type="password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-center space-x-4">
                <Avatar
                  className="h-12 w-12"
                  alt={`${customer?.first_name} ${customer?.last_name}`}
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
                className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-3 !mb-2"
                loadingPosition="center"
              >
                {loading ? t("Updating...") : t("Update")}
              </LoadingButton>

            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
