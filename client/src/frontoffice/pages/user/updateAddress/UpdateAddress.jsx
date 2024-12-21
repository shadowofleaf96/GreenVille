import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../../components/MetaData";
import { useRouter } from "../../../../routes/hooks";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { logout, fetchCustomerProfile } from "../../../../redux/frontoffice/customerSlice";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

const UpdateAddress = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { customer } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const axiosInstance = createAxiosInstance("customer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    const updatedShippingAddress = {
      street: data.street,
      city: data.city,
      postal_code: data.postal_code,
      phone_no: data.phone_number,
      // country: data.country, not needed for now
    };

    try {
      await handleSaveEditedShippingAddress(customer._id, updatedShippingAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditedShippingAddress = async (customerId, updatedShippingAddress) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/customers/${customerId}`, { shipping_address: updatedShippingAddress });
      dispatch(fetchCustomerProfile(customerId));
      setLoading(false);
      toast.success(t(response.data.message));
    } catch (error) {
      setLoading(false);
      toast.error("Error: " + (t(error.response.data.message)));
      console.log(error.response.data);
    }
  };

  return (
    <Fragment>
      <MetaData title={t("Update Address")} />
      <div className="flex flex-col bg-white py-6 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
          <div className="md:col-span-1 mb-4 md:mb-0">
            <ProfileLink />
          </div>
          <div className="md:col-span-3 bg-white shadow-lg rounded-2xl p-4 md:p-8">
            <h4 className="text-xl font-bold mb-4">{t("Update Address")}</h4>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2">
                <label htmlFor="street" className="block text-gray-700 font-medium">{t("Street")}</label>
                <input
                  id="street"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-500' : ''}`}
                  {...register("street", { required: t("StreetRequired") })}
                  placeholder={t("Street")}
                  type="text"
                />
                {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-gray-700 font-medium">{t("City")}</label>
                <input
                  id="city"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : ''}`}
                  {...register("city", { required: t("CityRequired") })}
                  placeholder={t("City")}
                  type="text"
                />
                {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="postal_code" className="block text-gray-700 font-medium">{t("Postal Code")}</label>
                <input
                  id="postal_code"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.postal_code ? 'border-red-500' : ''}`}
                  {...register("postal_code", { required: t("PostalCodeRequired") })}
                  placeholder={t("Postal Code")}
                  type="text"
                />
                {errors.postal_code && <p className="text-red-500 text-xs">{errors.postal_code.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone_number" className="block text-gray-700 font-medium">{t("PhoneNumber")}</label>
                <input
                  id="phone_number"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone_number ? 'border-red-500' : ''}`}
                  {...register("phone_number", {
                    required: t("PhoneNumberRequired"),
                    pattern: {
                      value: /^[0-9]{10}$/, // Simple phone number validation (10 digits)
                      message: t("PhoneNumberInvalid"),
                    },
                  })}
                  placeholder={t("PhoneNumber")}
                  type="text"
                />
                {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
              </div>

              {/* <div className="space-y-2">
                <label htmlFor="country" className="block text-gray-700 font-medium">{t("Country")}</label>
                <input
                  id="country"
                  className={`w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-500' : ''}`}
                  {...register("country", { required: t("CountryRequired") })}
                  placeholder={t("Country")}
                  type="text"
                />
                {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
              </div> */}

              <LoadingButton
                type="submit"
                fullWidth
                loading={loading}
                variant="contained"
                sx={{ fontWeight: 500, fontSize: 15 }}
                className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-3 !mb-2 !bottom-0"
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

export default UpdateAddress;
