"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { motion } from "framer-motion";

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
    <div className="mt-8">
      <div className="mx-auto mb-12 mt-12">
        <div className="container mx-auto">
          <h4 className="flex justify-center mx-auto mb-8 text-center md:text-start text-gray-900 select-none font-black sm:text-md md:text-lg lg:text-2xl xl:text-4xl h-12 uppercase tracking-[0.2em] backdrop-blur-sm px-4 py-1 rounded-full border border-white/10">
            {t("TopSubCategories")}
          </h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 px-4">
          {categories?.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="group relative aspect-3/4 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products/${item._id}`}
                className="block w-full h-full"
              >
                <LazyImage
                  wrapperClassName="w-full h-full relative"
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-center sm:text-left rtl:sm:text-right">
                  <h4 className="font-black text-2xl text-white uppercase tracking-tight mb-2">
                    {item.title}
                  </h4>
                  <div className="h-1.5 w-12 bg-primary rounded-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
