import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Category = () => {
  const { t } = useTranslation();

  const categories = [
    {
      image: "https://res.cloudinary.com/donffivrz/image/upload/c_scale,w_400,q_auto,f_auto/v1/greenville/03929db4ade075a1f1108d6d234cefec",
      title: t("Vegetables"),
      _id: "655c721c82ea0f3d8fc1db2d",
    },
    {
      image: "https://res.cloudinary.com/donffivrz/image/upload/c_scale,w_400,q_auto,f_auto/v1/greenville/b4c743a7cb116e8ef87629ca7e8f41e7",
      title: t("MakeupAccessories"),
      _id: "655c6d0682ea0f3d8fc1db03",
    },
    {
      image: "https://res.cloudinary.com/donffivrz/image/upload/c_scale,w_400,q_auto,f_auto/v1/greenville/a112987bf27a8fecac3ed125243a064b",
      title: t("EggsMilk"),
      _id: "6570cd56e4122425be4b73e9",
    },
    {
      image: "https://res.cloudinary.com/donffivrz/image/upload/c_scale,w_400,q_auto,f_auto/v1/greenville/e0760715d1923ecb31222fad2661a6f3",
      title: t("Honeys"),
      _id: "655c6e8d82ea0f3d8fc1db0f",
    },
  ];

  return (
    <div className="mt-8">
      <div className="mx-auto mb-12 mt-12">
        <div className="container mx-auto">
          <h4 className="font-semibold text-3xl flex justify-center mx-auto mb-8 text-center md:text-start text-gray-900 select-none">
            {t("TopSubCategories")}
          </h4>
        </div>
        <div className="flex flex-wrap gap-6 justify-center">
          {categories.map((item, index) => (
            <div key={index} className="w-auto flex flex-row flex-wrap text-center transition-all duration-300 hover:scale-105 select-none">
              <Link
                to={`/products/${item._id}`}
                className="relative flex items-center justify-center h-96 w-80 rounded-xl transition duration-500 ease-in-out hover:shadow-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 bg-white/15 backdrop-blur-md border border-white/15 w-full p-4">
                  <h4 className="font-semibold text-xl text-center text-yellow-400">
                    {item.title}
                  </h4>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
