"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { motion } from "framer-motion";
import { fadeInUp, premiumTransition } from "@/utils/animations";

const Category = () => {
  const { t } = useTranslation();

  const { data: settings } = useSelector((state) => state.adminSettings);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const categories =
    settings?.home_categories?.length > 0
      ? settings?.home_categories?.map((cat) => ({
          image: cat.category_image,
          title: cat.category_name
            ? cat?.category_name?.[currentLanguage]
            : "Category",
          _id: cat._id,
        }))
      : null;

  return (
    <div className="py-16 bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight">
            {t("TopSubCategories")}
          </h2>
          <div className="h-0.5 flex-1 bg-gray-100 rounded-full hidden md:block" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {categories?.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative aspect-3/4 rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-primary/20 transition-all duration-700"
            >
              <Link
                href={`/products/${item._id}`}
                className="block w-full h-full"
              >
                <LazyImage
                  wrapperClassName="w-full h-full relative"
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />

                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent group-hover:from-primary/80 transition-colors duration-700" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10 pointer-events-none">
                  <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{
                      ...fadeInUp.transition,
                      delay: index * 0.1 + 0.3,
                    }}
                  >
                    <h4 className="font-black text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                      {item.title}
                    </h4>
                    <div className="h-1.5 w-12 bg-primary rounded-full group-hover:w-20 transition-all duration-500" />
                  </motion.div>
                </div>

                {/* Glass Micro-shimmer on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
