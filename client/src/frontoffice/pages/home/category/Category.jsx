import React from "react";
import { Link } from "react-router-dom";

const Category = () => {
  const categories = [
    {
      image: "https://images.unsplash.com/photo-1563865436874-9aef32095fad?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Vegetables",
      _id: "655c721c82ea0f3d8fc1db2d",
    },
    {
      image: "https://i.pinimg.com/564x/a6/d4/71/a6d4719eec4b10f3c0dc3fc0fae7cc3b.jpg",
      title: "Make-up and Accessories",
      _id: "655c6d0682ea0f3d8fc1db03",
    },
    {
      image: "https://i.pinimg.com/564x/b1/0b/35/b10b35415eda92e675002e12cc9ab769.jpg",
      title: "Eggs & Milk",
      _id: "6570cd56e4122425be4b73e9",
    },
    {
      image: "https://i.pinimg.com/564x/88/36/d9/8836d903f33c8fc7eb4153e59ac9ef01.jpg",
      title: "Honeys",
      _id: "655c6e8d82ea0f3d8fc1db0f",
    },
  ];

  return (
    <div className="mt-8">
      <div className="mx-auto mb-12 mt-12">
        <div className="container mx-auto">
          <h4 className="font-semibold text-3xl flex justify-center mx-auto mb-8 text-center md:text-start text-gray-900 select-none">Top Categories Chosen for You</h4>
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
                  <h4 className="font-semibold text-xl text-center text-yellow-400">{item.title}</h4>
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
