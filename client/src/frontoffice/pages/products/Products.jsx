import React, { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Product from "./Product";
import Loader from "../../components/loader/Loader";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
import { getCategories } from "../../../redux/frontoffice/categoriesSlice";
import { getSubcategories } from "../../../redux/frontoffice/subcategoriesSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Divider, IconButton, Slider, Checkbox, Button, Modal, Box, Typography } from "@mui/material";
import Iconify from "../../../backoffice/components/iconify/iconify";
import { useTranslation } from "react-i18next";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isButtonHided, setIsButtonHided] = useState(true)
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language

  const { loading, products } = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const subcategoriesState = useSelector((state) => state.subcategories);
  const { categories } = categoriesState;
  const { subcategories } = subcategoriesState;
  const { subcategory } = useParams();

  useEffect(() => {
    setProductsPerPage(isMobile ? 10 : 9);
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
  }, [dispatch, products.length, categories.length, subcategories.length]);

  useEffect(() => {
    if (subcategory) {
      const foundSubcategory = subcategories.find(sub => sub._id === subcategory);
      if (foundSubcategory) {
        setSelectedSubcategories([foundSubcategory._id]);
        setSelectedCategories([foundSubcategory.category_id]);
        setIsCategoryOpen(true)
      }
    }
  }, [subcategory, subcategories]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.subcategory.category_id)
      );
    }

    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubcategories.includes(product.subcategory_id)
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

    return filtered;
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      if (!newSelectedCategories.includes(categoryId)) {
        setSelectedSubcategories([]);
      }

      const subcatsToKeep = subcategories.filter(sub => newSelectedCategories.includes(sub.category_id));
      setSelectedSubcategories(prevSubcategories =>
        prevSubcategories.filter(subId => subcatsToKeep.some(sub => sub._id === subId))
      );

      return newSelectedCategories;
    });
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const HandleCloseButton = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsButtonHided(true)
  }

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
    if (isFilterOpen) {
      setIsButtonHided(false)
    } else {
      setIsButtonHided(true)
    }
  };

  const handleApplyFilters = () => {
    setFilteredProduct(filterProducts());
    setCurrentPage(1);
    if (isMobile) {
      setIsFilterOpen(false);
      setIsButtonHided(true)
    }
  };

  useEffect(() => {
    setFilteredProduct(products);
    if (!isMobile) {
      setFilteredProduct(filterProducts());
      setCurrentPage(1);
    }
  }, [subcategory, selectedCategories, selectedSubcategories, selectedPriceRange, selectedOptions, products]);

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
      <MetaData title={"GreenVille - All Products"} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col min-h-[80vh] py-10">
            <div className="container mx-auto px-8 sm:px-10 lg:px-12">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-3"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >

                {!isMobile ? (
                  <div>
                    <motion.div
                      className="mt-5 p-4 rounded-3xl"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <h4 className="text-xl font-semibold mb-3 text-black">{t("filters")}</h4>
                      <hr className="my-3 border-t-2 border-black" />

                      <div className="mb-2 border-4 rounded-xl px-2">
                        <h5 className="flex justify-between font-semibold items-center cursor-pointer" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                          {t("categories")}
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
                                  checked={selectedCategories.includes(category._id)}
                                  onChange={() => handleCategoryChange(category._id)}
                                />
                                <label htmlFor={`category-${category._id}`} className="ml-2 rtl:mr-2">
                                  {t(category.category_name[currentLanguage])}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedCategories.length > 0 && (
                        <div className="mb-2 border-4 rounded-xl px-2">
                          <h5 className="flex justify-between items-center mt-2 font-semibold" onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}>{t("subcategories")}
                            <IconButton size="small">
                              <Iconify
                                icon="lsicon:down-outline"
                                width={30}
                                height={30}
                                className="text-gray-700"
                              />
                            </IconButton></h5>
                          {isSubCategoryOpen && (
                            <div className="mt-2 rounded mb-2">
                              {subcategories
                                .filter((sub) => selectedCategories.includes(sub.category_id))
                                .map((subcategory) => (
                                  <div key={subcategory._id} className="flex items-center mt-2 px-2 py-1 hover:bg-gray-100">
                                    <input
                                      type="checkbox"
                                      id={`subcategory-${subcategory._id}`}
                                      checked={selectedSubcategories.includes(subcategory._id)}
                                      onChange={() => handleSubcategoryChange(subcategory._id)}
                                    />
                                    <label htmlFor={`subcategory-${subcategory._id}`} className="ml-2 rtl:mr-2">
                                      {t(subcategory.subcategory_name[currentLanguage])}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mb-2 border-4 rounded-xl px-2">
                        <h5 className="flex justify-between font-semibold items-center cursor-pointer" onClick={() => setPriceRangeOpen(!priceRangeOpen)}>
                          {t("priceRange")}
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
                              max={1000}
                              step={10}
                              disableSwap
                              sx={{
                                direction: 'rtl',
                                '& .MuiSlider-thumb': {
                                  marginRight: '-10px !important',
                                },
                              }}
                            />
                            <div className="flex justify-between text-sm mb-2">
                              <span>{`${selectedPriceRange[0]} ${t("DH")}`}</span>
                              <span>{`${selectedPriceRange[1]} ${t("DH")}`}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mb-2 border-4 rounded-xl px-2">
                        <h5 className="flex justify-between font-semibold items-center cursor-pointer" onClick={() => setIsOptionOpen(!isOptionOpen)}>
                          {t("options")}
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
                                  checked={selectedOptions.includes(option)}
                                  onChange={() => {
                                    setSelectedOptions((prev) =>
                                      prev.includes(option)
                                        ? prev.filter((opt) => opt !== option)
                                        : [...prev, option]
                                    );
                                  }}
                                />
                                <label htmlFor={`option-${option}`} className="ml-2 rtl:mr-2">{t(option)}</label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <Modal open={isFilterOpen} onClose={handleFilterToggle}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        width: { xs: '90%', sm: '75%', md: '50%' },
                        maxHeight: '90vh',
                        overflowY: 'auto',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          {t("filters")}
                        </Typography>
                        <IconButton onClick={HandleCloseButton}>
                          <Iconify icon="bi:x" width={32} height={32} />
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        {t("categories")}
                      </Typography>
                      <Box maxHeight="150px" overflow="auto">
                        {categories.map((category) => (
                          <Box key={category._id} display="flex" alignItems="center" mt={1}>
                            <Checkbox
                              checked={selectedCategories.includes(category._id)}
                              onChange={() => handleCategoryChange(category._id)}
                            />
                            <Typography
                              ml={1}
                              onClick={() => handleCategoryChange(category._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {t(category.category_name[currentLanguage])}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {selectedCategories.length > 0 && (
                        <>
                          <Typography variant="subtitle1" fontWeight="bold" mt={2} mb={1}>
                            {t("subcategories")}
                          </Typography>
                          <Box maxHeight="150px" overflow="auto">
                            {subcategories
                              .filter((sub) => selectedCategories.includes(sub.category_id))
                              .map((subcategory) => (
                                <Box key={subcategory._id} display="flex" alignItems="center" mt={1}>
                                  <Checkbox
                                    checked={selectedSubcategories.includes(subcategory._id)}
                                    onChange={() => handleSubcategoryChange(subcategory._id)}
                                  />
                                  <Typography ml={1}
                                    onClick={() => handleSubcategoryChange(subcategory._id)}
                                    style={{ cursor: 'pointer' }}
                                  >{t(subcategory.subcategory_name[currentLanguage])}</Typography>
                                </Box>
                              ))}
                          </Box>
                        </>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Box mt={3}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {t("priceRange")}
                        </Typography>
                        <Slider
                          value={selectedPriceRange}
                          onChange={(event, newValue) => setSelectedPriceRange(newValue)}
                          valueLabelDisplay="auto"
                          min={0}
                          max={1000}
                          step={10}
                          sx={{
                            '& .MuiSlider-thumb': { marginRight: '-10px' },
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" fontSize="small">
                          <Typography>{`${selectedPriceRange[0]} ${t("DH")}`}</Typography>
                          <Typography>{`${selectedPriceRange[1]} ${t("DH")}`}</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box mt={3}>
                        <Box display="flex" alignItems="center" onClick={() => setIsOptionOpen(!isOptionOpen)}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {t("options")}
                          </Typography>
                          <IconButton size="small">
                            <Iconify icon="lsicon:down-outline" width={30} height={30} />
                          </IconButton>
                        </Box>
                        {isOptionOpen && (
                          <>
                            {["Flash Sales", "New Arrivals", "Top Deals"].map((option) => (
                              <Box key={option} display="flex" alignItems="center" mt={1}>
                                <Checkbox
                                  checked={selectedOptions.includes(option)}
                                  onChange={() =>
                                    setSelectedOptions((prev) =>
                                      prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option]
                                    )
                                  }
                                />
                                <Typography
                                  ml={1}
                                  onClick={() =>
                                    setSelectedOptions((prev) =>
                                      prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option]
                                    )
                                  }
                                  style={{ cursor: 'pointer' }}
                                >
                                  {t(option)}
                                </Typography>
                              </Box>

                            ))}
                          </>
                        )}
                      </Box>

                      <Button
                        onClick={handleApplyFilters}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, backgroundColor: '#8DC63F', color: 'white' }}
                      >
                        {t("apply_filters")}
                      </Button>
                    </Box>
                  </Modal>
                )}

                <AnimatePresence>
                  {!isFilterOpen && (
                    <motion.div
                      className="lg:col-span-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {currentProducts.length > 0 ? (
                        <>
                          <h2 className="text-2xl font-semibold mt-2 mb-2">{t("Products")}</h2>
                          <div className={`h-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 ${isFilterOpen ? "overflow-hidden" : "overflow-auto"}`}>
                            {currentProducts.map((product) => (
                              <Product key={product._id} product={product} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center w-full">
                          <Iconify className="mb-2" icon="mdi:alert-circle-outline" width={100} height={100} />
                          <h2 className="text-2xl font-semibold mb-2">{t("Error Loading Products")}</h2> {/* Update the translation key here */}
                          <p className="text-gray-600 mb-6">{t("There was an issue loading the products. Please try again later.")}</p> {/* Update this message here */}
                          <button
                            className="px-6 p-3 bg-[#8DC63F] text-white shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg rounded-md hover:shadow-yellow-400"
                            onClick={() => navigate(0)}
                          >
                            {t("Reload")}
                          </button>
                        </div>
                      )}

                      {filteredProduct.length > productsPerPage && (
                        <div className="flex justify-center mt-5 rtl:ml-2">
                          <button
                            onClick={handlePrevPage}
                            className="rounded-full border py-2 px-4 text-sm rtl:ml-2 text-slate-800 hover:bg-[#8DC63F] hover:text-white"
                            disabled={currentPage === 1}
                          >
                            {t("previous")}
                          </button>
                          {Array.from({ length: Math.ceil(filteredProduct.length / productsPerPage) }, (_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`h-auto rounded-full hidden md:block border rtl:ml-2 py-2 px-4 text-sm ${index + 1 === currentPage ? "bg-[#8DC63F] text-white" : "text-slate-800"
                                }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          <button
                            onClick={handleNextPage}
                            className="rounded-full border py-2 px-4 text-sm rtl:ml-2 text-slate-800 hover:bg-[#8DC63F] hover:text-white"
                            disabled={currentPage === Math.ceil(filteredProduct.length / productsPerPage)}
                          >
                            {t("next")}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {isButtonHided && (
                <button
                  className="fixed bottom-14 right-10 bg-[#8DC63F] text-white p-3 rounded-full shadow-lg z-50 md:hidden"
                  onClick={handleFilterToggle}
                >
                  <Iconify icon="bi:filter" width={24} height={24} />
                </button>
              )}
            </div>
          </div>
        </>
      )
      }
    </Fragment >
  );
};

export default Products;
