import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../../components/MetaData";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { fetchCustomerProfile } from "../../../../redux/frontoffice/customerSlice";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Iconify from "../../../../backoffice/components/iconify";
import MapPicker from "../../../../components/map/MapPicker";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateAddress = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { customer } = useSelector((state) => state.customers);

  const [latitude, setLatitude] = useState(
    customer?.shipping_address?.latitude || 33.5731,
  );
  const [longitude, setLongitude] = useState(
    customer?.shipping_address?.longitude || -7.5898,
  );

  const dispatch = useDispatch();
  const axiosInstance = createAxiosInstance("customer");

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\D/g, "");
    if (sanitized.startsWith("00212")) {
      sanitized = "0" + sanitized.slice(5);
    } else if (sanitized.startsWith("212")) {
      sanitized = "0" + sanitized.slice(3);
    }
    if (sanitized && !sanitized.startsWith("0")) {
      sanitized = "0" + sanitized;
    }
    return sanitized;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      street: customer?.shipping_address?.street || "",
      city: customer?.shipping_address?.city || "",
      postal_code: customer?.shipping_address?.postal_code || "",
      phone_number: customer?.shipping_address?.phone_no || "",
    },
  });

  const onSubmit = async (data) => {
    const updatedShippingAddress = {
      street: data.street,
      city: data.city,
      postal_code: data.postal_code,
      phone_no: formatPhone(data.phone_number),
      latitude,
      longitude,
    };

    try {
      await handleSaveEditedShippingAddress(
        customer._id,
        updatedShippingAddress,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditedShippingAddress = async (
    customerId,
    updatedShippingAddress,
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/customers/${customerId}`, {
        shipping_address: updatedShippingAddress,
      });
      dispatch(fetchCustomerProfile(customerId));
      setLoading(false);
      toast.success(t(response.data.message));
    } catch (error) {
      setLoading(false);
      toast.error(
        "Error: " + t(error.response?.data?.message || "Unknown error"),
      );
    }
  };

  return (
    <Fragment>
      <MetaData title={t("Update Address")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <ProfileLink />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-4xl sm:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
              >
                <div className="p-6 sm:p-12 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-gray-50">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        {t("Delivery Details")}
                      </h1>
                      <p className="text-sm font-bold text-gray-400 italic">
                        {t(
                          "Keep your primary shipping information up to date for faster checkouts.",
                        )}
                      </p>
                    </div>

                    <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                      <Iconify icon="solar:map-point-bold-duotone" width={32} />
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-2">
                        <Label
                          htmlFor="street"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("Street Address")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:map-point-wave-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="street"
                            {...register("street", {
                              required: t("StreetRequired"),
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.street ? "border-red-500" : ""
                            }`}
                            placeholder={t("123 Main St")}
                          />
                        </div>
                        {errors.street && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.street.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="city"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("City")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:city-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="city"
                            {...register("city", {
                              required: t("CityRequired"),
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.city ? "border-red-500" : ""
                            }`}
                            placeholder={t("City")}
                          />
                        </div>
                        {errors.city && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="postal_code"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("Postal Code")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:streets-map-point-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="postal_code"
                            {...register("postal_code", {
                              required: t("PostalCodeRequired"),
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.postal_code ? "border-red-500" : ""
                            }`}
                            placeholder={t("Postal Code")}
                          />
                        </div>
                        {errors.postal_code && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.postal_code.message}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label
                          htmlFor="phone_number"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("Contact Phone")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:phone-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="phone_number"
                            {...register("phone_number", {
                              required: t("PhoneNumberRequired"),
                              onChange: (e) => {
                                e.target.value = e.target.value.replace(
                                  /\D/g,
                                  "",
                                );
                              },
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.phone_number ? "border-red-500" : ""
                            }`}
                            placeholder={t("e.g. 0600000000")}
                          />
                        </div>
                        {errors.phone_number && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-gray-50" />

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                          <Iconify icon="solar:map-bold-duotone" width={24} />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                            {t("Precise Pin Location")}
                          </h2>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                            {t("Help our delivery team find you instantly")}
                          </p>
                        </div>
                      </div>

                      <MapPicker
                        initialPosition={{ lat: latitude, lng: longitude }}
                        onLocationSelect={({ latitude, longitude }) => {
                          setLatitude(latitude);
                          setLongitude(longitude);
                        }}
                      />
                      <div className="flex justify-between px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            {t("Latitude")}
                          </p>
                          <p className="text-xs font-bold text-gray-900">
                            {latitude.toFixed(6)}
                          </p>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            {t("Longitude")}
                          </p>
                          <p className="text-xs font-bold text-gray-900">
                            {longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-50" />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 rounded-4xl bg-primary text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all gap-3 border-none"
                      >
                        {loading ? (
                          <>
                            <Iconify
                              icon="svg-spinners:ring-resize"
                              width={24}
                            />
                            {t("Processing...")}
                          </>
                        ) : (
                          <>
                            <Iconify
                              icon="solar:check-circle-bold-duotone"
                              width={24}
                            />
                            {t("Update Address")}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Information Footer */}
                  <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-center gap-4">
                    <Iconify
                      icon="solar:delivery-bold-duotone"
                      width={24}
                      className="text-primary"
                    />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed text-center">
                      {t(
                        "Accurate shipping details ensure timely delivery. Please verify all fields before saving.",
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateAddress;
