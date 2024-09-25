import React, { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { Link, useParams } from "react-router-dom";
import Product from "./Product";
import Loader from "../../components/loader/Loader";
import Pagination from "react-js-pagination";
import Navbar from "../../components/header/Navbar";
import Iconify from "../../../backoffice/components/iconify/iconify";
import Footer from "../../components/footer/Footer";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import MetaData from "../../components/MetaData";
import { getCategories } from "../../../redux/frontoffice/categoriesSlice";
import { getSubcategories } from "../../../redux/frontoffice/subcategoriesSlice";
import { sub } from "date-fns";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [openCategoryId, setOpenCategoryId] = useState(null);

  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const {
    loading,
    products,
    error,
    productsCount,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const subcategoriesState = useSelector((state) => state.subcategories);

  const { categories } = categoriesState;
  const { subcategories } = subcategoriesState;

  const handleSubcategoryClick = (subcategoryId) => {
    const filter = products.filter((el) => el.subcategory_id === subcategoryId);
    setFilteredProduct(filter);
  };

  const handleAllCategory = () => {
    setFilteredProduct(products);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
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
        const filteredProducts = products.filter((product) =>
          product.subcategory_id === categoryId
        );
        setFilteredProduct(filteredProducts);
      } else {
        setFilteredProduct(products);
      }
    }
  }, [products, categoryId]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  let count = filteredProduct.length;

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col min-h-screen py-10">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <div>
                  <div className="mb-5 p-4 rounded-3xl bg-yellow-200">
                    <h4 className="text-xl font-semibold mb-3 text-black">Filter by Categories</h4>
                    <hr className="my-3 border-t-2 border-black" />
                    <Accordion open={false}>
                      <AccordionHeader className="text-black border-0 h-6 my-2 text-lg hover:underline font-light" onClick={handleAllCategory}>
                        <Link to="/products">
                          All
                        </Link>
                      </AccordionHeader>
                    </Accordion>
                    <Accordion open={openCategoryId !== null}>
                      {categories.map((category) => (
                        <div key={category._id}>
                          <AccordionHeader
                            onClick={() =>
                              setOpenCategoryId(openCategoryId === category._id ? null : category._id)
                            }
                            className="text-black h-6 my-2 flex w-full justify-start border-0 text-lg hover:underline font-light"
                          >
                            {category.category_name}
                            <Iconify
                              icon="ep:arrow-right-bold" width={20}
                              height={20}
                              className="ml-auto"
                            />
                          </AccordionHeader>
                          {openCategoryId === category._id && (
                            <AccordionBody className="py-0 mb-2">
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
                            </AccordionBody>
                          )}
                        </div>
                      ))}
                    </Accordion>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProduct.map((product) => (
                      <Product key={product._id} product={product} />
                    ))}
                  </div>
                  {resPerPage <= count && (
                    <div className="flex justify-center mt-5">
                      <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resPerPage}
                        totalItemsCount={productsCount}
                        onChange={setCurrentPageNo}
                        nextPageText={"Next"}
                        prevPageText={"Prev"}
                        firstPageText={"First"}
                        lastPageText={"Last"}
                        itemClass="page-item"
                        linkClass="page-link"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={closeSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Alert
                onClose={closeSnackbar}
                severity={snackbarMessage.includes("Error") ? "error" : "success"}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </div>
        </>
      )}
      <Footer />
    </Fragment>
  );
};

export default Products;
