"use client";

import { Fragment } from "react";
import MetaData from "@/frontoffice/_components/MetaData";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Iconify from "@/components/shared/iconify";
import { Button } from "@/components/ui/button";

const Success = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Fragment>
      <MetaData title={t("paymentSuccess") || "Payment Success"} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center space-y-12"
        >
          {/* Celebratory Icon */}
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="w-32 h-32 sm:w-40 sm:h-40 bg-primary/5 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center relative z-10 border border-primary/10"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary rounded-4xl sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/40">
                <Iconify
                  icon="solar:check-circle-bold-duotone"
                  width={40}
                  className="text-white sm:w-16"
                />
              </div>

              {/* Decorative Particles (Animated) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -z-10"
              >
                <Iconify
                  icon="solar:stars-bold-duotone"
                  width={24}
                  className="text-primary/20 absolute -top-4 left-1/2 -translate-x-1/2"
                />
                <Iconify
                  icon="solar:stars-bold-duotone"
                  width={24}
                  className="text-primary/20 absolute -bottom-4 left-1/2 -translate-x-1/2"
                />
                <Iconify
                  icon="solar:stars-bold-duotone"
                  width={24}
                  className="text-primary/20 absolute top-1/2 -left-4 -translate-y-1/2"
                />
                <Iconify
                  icon="solar:stars-bold-duotone"
                  width={24}
                  className="text-primary/20 absolute top-1/2 -right-4 -translate-y-1/2"
                />
              </motion.div>
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full scale-150 animate-pulse" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              {t("Order Confirmed!")}
            </h1>
            <p className="text-lg font-medium text-gray-500 max-w-sm mx-auto leading-relaxed italic">
              {t("orderSuccessDescription")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Button
              size="lg"
              onClick={() => router.push("/profile/orders")}
              className="w-full sm:w-auto h-16 px-10 rounded-4xl bg-gray-900 text-white font-black uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-3 border-none"
            >
              <Iconify icon="solar:list-check-bold-duotone" width={24} />
              {t("View My Orders")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/products")}
              className="w-full sm:w-auto h-16 px-10 rounded-4xl border-2 border-primary bg-primary/5 text-primary font-black uppercase tracking-widest hover:bg-primary/10 transition-all gap-3"
            >
              <Iconify icon="solar:bag-heart-bold-duotone" width={24} />
              {t("Continue Shopping")}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
              <Iconify
                icon="solar:letter-bold-duotone"
                width={18}
                className="text-primary"
              />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("Confirmation email has been sent to your inbox")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default Success;
