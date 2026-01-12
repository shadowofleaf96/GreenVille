import { Fragment } from "react";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../../../components/MetaData";
import { useTranslation } from "react-i18next";
import Iconify from "../../../../backoffice/components/iconify";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MyProfile = () => {
  const { t } = useTranslation();
  const { customer, loading } = useSelector((state) => state.customers);

  const ProfileSkeleton = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Skeleton className="h-48 w-full rounded-[3rem]" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 rounded-[2.5rem]" />
        <Skeleton className="h-64 rounded-[2.5rem]" />
      </div>
    </div>
  );

  return (
    <Fragment>
      <MetaData title={t("Profile")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <ProfileLink />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <ProfileSkeleton />
              ) : (
                <div className="space-y-10">
                  {/* Header Profile Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-white rounded-4xl sm:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 group"
                  >
                    {/* Decorative background gradient */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent border-b border-gray-50/50" />

                    <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end gap-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Avatar className="h-32 w-32 border-8 border-white shadow-2xl relative z-10 scale-100 group-hover:scale-105 transition-transform duration-700">
                          <AvatarImage
                            src={customer?.customer_image}
                            alt={`${customer?.first_name} ${customer?.last_name}`}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary text-white font-black text-3xl">
                            {customer?.first_name?.charAt(0)}
                            {customer?.last_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="text-center md:text-left grow space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                            {customer?.first_name} {customer?.last_name}
                          </h1>
                          <Badge className="bg-green-100 text-green-700 font-black text-[10px] uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 border-none">
                            <Iconify
                              icon="solar:verified-check-bold"
                              width={14}
                            />
                            {t("Verified Account")}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-gray-400 italic">
                          {customer?.email}
                        </p>

                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                          {customer?.shipping_address?.phone_no && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                              <Iconify
                                icon="solar:phone-bold-duotone"
                                width={18}
                                className="text-primary"
                              />
                              {customer.shipping_address.phone_no}
                            </div>
                          )}
                          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                            <Iconify
                              icon="solar:calendar-bold-duotone"
                              width={18}
                              className="text-primary"
                            />
                            {t("Member since")}{" "}
                            {new Date(
                              customer?.createdAt || Date.now()
                            ).getFullYear()}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/profile/updateprofile`}
                        className="w-full md:w-auto"
                      >
                        <Button className="w-full md:w-auto h-16 px-10 rounded-4xl bg-gray-900 text-white font-black uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-3 border-none">
                          <Iconify
                            icon="solar:pen-new-square-bold-duotone"
                            width={24}
                          />
                          {t("Edit Profile")}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Account Summary Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="h-full bg-white rounded-4xl sm:rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden">
                        <CardContent className="p-6 sm:p-10 space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                              <Iconify
                                icon="solar:card-2-bold-duotone"
                                width={28}
                              />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                              {t("Account Info")}
                            </h2>
                          </div>

                          <div className="space-y-6">
                            {[
                              {
                                label: t("First Name"),
                                value: customer?.first_name,
                              },
                              {
                                label: t("Last Name"),
                                value: customer?.last_name,
                              },
                              {
                                label: t("Email Address"),
                                value: customer?.email,
                              },
                              {
                                label: t("Status"),
                                value: t("Verified"),
                                isBadge: true,
                              },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className={`flex justify-between items-center ${
                                  idx < 3 ? "pb-6 border-b border-gray-50" : ""
                                }`}
                              >
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  {item.label}
                                </span>
                                {item.isBadge ? (
                                  <Badge className="bg-green-50 text-green-600 font-black text-[10px] uppercase tracking-widest px-3 py-1 border-none">
                                    {item.value}
                                  </Badge>
                                ) : (
                                  <span className="text-sm font-black text-gray-900 italic">
                                    {item.value}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Shipping Address Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="h-full bg-white rounded-4xl sm:rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden">
                        <CardContent className="p-6 sm:p-10 space-y-8">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                                <Iconify
                                  icon="solar:map-point-bold-duotone"
                                  width={28}
                                />
                              </div>
                              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                {t("Delivery Details")}
                              </h2>
                            </div>
                            <Link to={`/profile/updateaddress`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-10 h-10 rounded-xl hover:bg-primary/5 hover:text-primary text-gray-400 transition-all"
                              >
                                <Iconify
                                  icon="solar:pen-new-square-bold-duotone"
                                  width={20}
                                />
                              </Button>
                            </Link>
                          </div>

                          <div className="space-y-8">
                            {customer?.shipping_address ? (
                              <>
                                <div className="space-y-4">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                      {t("Full Address")}
                                    </p>
                                    <p className="text-sm font-black text-gray-900 leading-relaxed italic">
                                      {customer.shipping_address.street ||
                                        t("Not Set")}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {t("City")}
                                      </p>
                                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                        {customer.shipping_address.city ||
                                          t("Not Set")}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {t("Postal Code")}
                                      </p>
                                      <p className="text-sm font-black text-gray-900 italic">
                                        {customer.shipping_address
                                          .postal_code || t("Not Set")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-10 space-y-4 bg-gray-50/50 rounded-4xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-gray-300">
                                  <Iconify
                                    icon="solar:map-point-remove-bold-duotone"
                                    width={32}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                                    {t("addressNotSpecified")}
                                  </p>
                                  <Link
                                    to="/profile/updateaddress"
                                    className="text-primary font-black text-sm uppercase tracking-tight hover:underline flex items-center justify-center gap-2"
                                  >
                                    <Iconify
                                      icon="solar:add-circle-bold"
                                      width={18}
                                    />
                                    {t("Add Delivery Address")}
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Security Footer Small */}
                          <div className="pt-4 flex items-center gap-3">
                            <Iconify
                              icon="solar:shield-check-bold-duotone"
                              width={20}
                              className="text-primary"
                            />
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                              {t(
                                "Your information is securely encrypted and never shared with third parties."
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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

export default MyProfile;
