import React, { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { Link, useParams } from "react-router-dom";
import Product from "./Product";
import Loader from "../../components/loader/Loader";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
import { getCategories } from "../../../redux/frontoffice/categoriesSlice";
import { getSubcategories } from "../../../redux/frontoffice/subcategoriesSlice";
import { motion } from "framer-motion"; // Importing framer-motion for animations

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const { loading, products, error, productsCount } = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const subcategoriesState = useSelector((state) => state.subcategories);
  const { categories } = categoriesState;
  const { subcategories } = subcategoriesState;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProduct.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProduct.length / productsPerPage);

  const handleSubcategoryClick = (subcategoryId) => {
    const filter = products.filter((el) => el.subcategory_id === subcategoryId);
    setFilteredProduct(filter);
  };

  const handleAllCategory = () => {
    setFilteredProduct(products);
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts("", currentPage));
    }

    if (categories.length === 0) {
      dispatch(getCategories());
    }
    if (subcategories.length === 0) {
      dispatch(getSubcategories());
    }
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (categoryId) {
      handleSubcategoryClick(categoryId);
    } else {
      setFilteredProduct(products);
    }
  }, [categoryId, products]);

  useEffect(() => {
    if (products.length > 0) {
      if (categoryId) {
        const filteredProducts = products.filter((product) => product.subcategory_id === categoryId);
        setFilteredProduct(filteredProducts);
      } else {
        setFilteredProduct(products);
      }
    }
  }, [products, categoryId]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleAccordion = (id) => {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      icon.style.transform = "rotate(0deg)";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.style.transform = "rotate(45deg)";
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col min-h-screen py-10">
            <div className="container mx-auto">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-4 gap-5"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <motion.div
                    className="mb-5 p-4 rounded-3xl bg-yellow-200"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-black">Filter by Categories</h4>
                    <hr className="my-3 border-t-2 border-black" />
                    <div className="border-b border-slate-200">
                      <button onClick={handleAllCategory} className="w-full flex justify-between items-center py-3 text-slate-800">
                        <span>All Categories</span>
                      </button>
                      <div id="content-1" className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                        <div className="pb-5 text-sm text-slate-500">
                          <ul className="list-none p-0">
                            {categories.map((category) => (
                              <li key={category._id} className="mt-3">
                                <Link
                                  to={`/products/${category._id}`}
                                  className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 hover:bg-gray-200"
                                >
                                  {category.category_name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {categories.map((category) => (
                      <div className="border-b border-slate-200" key={category._id}>
                        <button onClick={() => toggleAccordion(category._id)} className="w-full flex justify-between items-center py-3 text-slate-800">
                          <span>{category.category_name}</span>
                          <span id={`icon-${category._id}`} className="text-black transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                            </svg>
                          </span>
                        </button>
                        <div id={`content-${category._id}`} className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                          <div className="pb-5 text-sm text-slate-500">
                            <ul className="list-none p-0">
                              {subcategories
                                .filter((subcategory) => subcategory.category_id === category._id)
                                .map((subcategory) => (
                                  <li key={subcategory._id} className="mt-3">
                                    <Link
                                      to={`/products/${subcategory._id}`}
                                      onClick={() => handleSubcategoryClick(subcategory._id)}
                                      className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 hover:bg-gray-200"
                                    >
                                      {subcategory.subcategory_name}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  className="lg:col-span-3"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {
                    totalPages > 1 && (
                      <div className="flex justify-center mb-5 space-x-2">
                        <button
                          onClick={handlePrevPage}
                          className="rounded-full border py-2 px-4 text-sm text-slate-600 hover:bg-[#8DC63F] hover:text-white"
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`rounded-full py-2 px-4 text-sm ${currentPage === index + 1 ? 'bg-[#8DC63F] text-white' : 'border text-slate-600'}`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={handleNextPage}
                          className="rounded-full border py-2 px-4 text-sm text-slate-600 hover:bg-[#8DC63F] hover:text-white"
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )
                  }
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentProducts.map((product) => (
                      <motion.div key={product._id} whileHover={{ scale: 1.05 }}>
                        <Product product={product} />
                      </motion.div>
                    ))}
                  </div>

                  {
                    totalPages > 1 && (
                      <div className="flex justify-center mt-5 space-x-2">
                        <button
                          onClick={handlePrevPage}
                          className="rounded-full border py-2 px-4 text-sm text-slate-600 hover:bg-[#8DC63F] hover:text-white"
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`rounded-full py-2 px-4 text-sm ${currentPage === index + 1 ? 'bg-[#8DC63F] text-white' : 'border text-slate-600'}`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={handleNextPage}
                          className="rounded-full border py-2 px-4 text-sm text-slate-600 hover:bg-[#8DC63F] hover:text-white"
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )
                  }
                </motion.div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default Products;