import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeInUp, premiumTransition } from "@/utils/animations";

const Benefits = () => {
  const { i18n } = useTranslation();
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );
  const benefits = settings?.benefits?.length > 0 ? settings.benefits : [];

  const currentLang = i18n.language;

  if (loading) {
    return (
      <div className="bg-gray-50 py-12 flex justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ ...fadeInUp.transition, delay: index * 0.2 }}
              className="group relative p-8 rounded-[3rem] bg-gray-50 border border-gray-100 hover:bg-primary transition-all duration-500 text-center flex flex-col items-center shadow-xl shadow-gray-100/50 hover:shadow-primary/30"
            >
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                <Iconify
                  icon={benefit.icon}
                  className="relative z-10 text-primary group-hover:text-white transition-colors duration-500"
                  width={64}
                  height={64}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black text-gray-900 group-hover:text-white uppercase tracking-tight transition-colors duration-500">
                  {benefit.title?.[currentLang] || benefit.title?.en || ""}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/80 font-medium leading-relaxed transition-colors duration-500 max-w-60 mx-auto">
                  {benefit.description?.[currentLang] ||
                    benefit.description?.en ||
                    ""}
                </p>
              </div>

              {/* Decorative Shimmer */}
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none rounded-[3rem]" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
