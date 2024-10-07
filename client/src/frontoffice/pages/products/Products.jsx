import React, { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { Link, useParams } from "react-router-dom";
import Product from "./Product";
import Loader from "../../components/loader/Loader";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
import { getCategories } from "../../../redux/frontoffice/categoriesSlice";
import { getSubcategories } from "../../../redux/frontoffice/subcategoriesSlice";
import { motion } from "framer-motion";
import { Select, MenuItem, IconButton, Slider } from "@mui/material";
import Iconify from "../../../backoffice/components/iconify/iconify";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);

  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const { loading, products, error } = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const subcategoriesState = useSelector((state) => state.subcategories);
  const { categories } = categoriesState;
  const { subcategories } = subcategoriesState;

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

  const handleFilterChange = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.subcategory.category_id)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= selectedPriceRange[0] &&
        product.price <= selectedPriceRange[1]
    );

    if (selectedOptions.length > 0) {
      filtered = filtered.filter((product) =>
        product.option.some((option) => selectedOptions.includes(option))
      );
    }

    setFilteredProduct(filtered);
    setCurrentPage(1);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    const filter = products.filter((el) => el.subcategory_id === subcategoryId);
    setFilteredProduct(filter);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategories, selectedPriceRange, selectedOptions]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProduct.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProduct.length / productsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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
            <div className="container mx-auto px-8 sm:px-10 lg:px-12">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-4 gap-5"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <motion.div
                    className="mt-5 p-4 rounded-3xl"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-black">Filters</h4>
                    <hr className="my-3 border-t-2 border-black" />

                    <div className="mb-2 border-4 rounded-xl px-2">
                      <h5 className="flex justify-between font-semibold items-center cursor-pointer" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                        Categories
                        <IconButton size="small">
                          <Iconify
                            icon="lsicon:down-outline"
                            width={30}
                            height={30}
                            className="text-gray-700"
                          />
                        </IconButton>
                      </h5>
                      {isCategoryOpen && (
                        <div className="mt-2 rounded mb-2">
                          {categories.map((category) => (
                            <div key={category._id} className="flex items-center mt-2 px-2 py-1 hover:bg-gray-100">
                              <input
                                type="checkbox"
                                id={`category-${category._id}`}
                                onChange={() => {
                                  setSelectedCategories((prev) =>
                                    prev.includes(category._id)
                                      ? prev.filter((id) => id !== category._id)
                                      : [...prev, category._id]
                                  );
                                }}
                              />
                              <label htmlFor={`category-${category._id}`} className="ml-2">
                                {category.category_name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mb-2 border-4 rounded-xl px-2">
                      <h5 className="flex justify-between font-semibold items-center cursor-pointer" onClick={() => setPriceRangeOpen(!priceRangeOpen)}>
                        Price Range
                        <IconButton size="small">
                          <Iconify
                            icon="lsicon:down-outline"
                            width={30}
                            height={30}
                            className="text-gray-700"
                          />
                        </IconButton>
                      </h5>
                      {priceRangeOpen && (
                        <div className="w-auto px-4">
                          <Slider
                            value={selectedPriceRange}
                            onChange={(event, newValue) => setSelectedPriceRange(newValue)}
                            valueLabelDisplay="auto"
                            size="small"
                            min={0}
                            disableSwap
                            max={1000}
                            step={10}
                          />
                          <div className="flex justify-between text-sm mb-2">
                            <span>{`$${selectedPriceRange[0]}`}</span>
                            <span>{`$${selectedPriceRange[1]}`}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-2 border-4 rounded-xl px-2">
                      <h5 className="flex justify-between font-semibold items-center cursor-pointer" onClick={() => setIsOptionOpen(!isOptionOpen)}>
                        Options
                        <IconButton size="small">
                          <Iconify
                            icon="lsicon:down-outline"
                            width={30}
                            height={30}
                            className="text-gray-700"
                          />
                        </IconButton>
                      </h5>
                      {isOptionOpen && (
                        <div className="mt-2 rounded mb-2">
                          {["Flash Sales", "New Arrivals", "Top Deals"].map((option) => (
                            <div key={option} className="flex items-center mt-2 px-2 py-1 hover:bg-gray-100">
                              <input
                                type="checkbox"
                                id={`option-${option}`}
                                onChange={() => {
                                  setSelectedOptions((prev) =>
                                    prev.includes(option)
                                      ? prev.filter((opt) => opt !== option)
                                      : [...prev, option]
                                  );
                                }}
                              />
                              <label htmlFor={`option-${option}`} className="ml-2">{option}</label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="lg:col-span-3"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                    {currentProducts.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>

                  {filteredProduct.length > productsPerPage && (
                    <div className="flex justify-center mt-5">
                      <button
                        onClick={handlePrevPage}
                        className="rounded-full border py-2 px-4 text-sm text-slate-800 hover:bg-[#8DC63F] hover:text-white"
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.ceil(filteredProduct.length / productsPerPage) }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`h-auto rounded-full border py-2 px-4 text-sm ${index + 1 === currentPage ? "bg-[#8DC63F] text-white" : "text-slate-800"
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={handleNextPage}
                        className="rounded-full border py-2 px-4 text-sm text-slate-800 hover:bg-[#8DC63F] hover:text-white"
                        disabled={currentPage === Math.ceil(filteredProduct.length / productsPerPage)}
                      >
                        Next
                      </button>
                    </div>
                  )}
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
