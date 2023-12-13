import React, { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { Link, useParams } from "react-router-dom";
import Product from "./Product";
import Loader from "../../components/loader/Loader";
import styles from "./Products.module.scss";
import Pagination from "react-js-pagination";
import "rc-slider/assets/index.css";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import Accordion from "react-bootstrap/Accordion";
import MetaData from "../../components/MetaData";
import { getCategories } from "../../../redux/frontoffice/categoriesSlice";
import { getSubcategories } from "../../../redux/frontoffice/subcategoriesSlice";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [productsfiltre, setProductsFiltre] = useState([]);

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

  const handleSubcategoryClick = async (subcategoryId) => {
    const filter = products.filter((el) => el.subcategory_id === subcategoryId);
    setFilteredProduct(filter);
  };
  const handleAllCategory = async () => {
    setFilteredProduct(products);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  let { keyword } = useParams();

  useEffect(() => {
    dispatch(getProducts(keyword, currentPage));
    dispatch(getCategories());
    dispatch(getSubcategories());
  }, [dispatch, error, keyword, currentPage]);

  useEffect(() => {
    if (products.length > 0) {
      if (keyword) {
        const filteredProducts = products.filter((product) =>
          product.product_name.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredProduct(filteredProducts);
      } else {
        setFilteredProduct(products);
      }
    }
  }, [products, keyword]);

  useEffect(() => {
    handlesubcategory(categoryId);
  }, [categoryId]);

  const handlesubcategory = async (subcategoryId) => {
    const filter = products.filter((el) => el.subcategory_id === subcategoryId);
    setProductsFiltre(filter);
  };

  const handleClick = (subcategoryId) => {
    handleSubcategoryClick(subcategoryId);
  };

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  let count = keyword ? filteredProductsCount : productsCount;

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.products}>
            <div className="container mb-5" style={{ marginTop: "30px" }}>
              <div className="row g-3">
                <div className="col-lg-3 pe-5">
                  <div className={styles.filter}>
                    <div
                      style={{
                        marginTop: "70px",
                        paddingRight: "15px",
                        paddingLeft: "15px",
                      }}
                    ></div>
                  </div>
                  <div>
                    <h4>Categories</h4>
                    <hr className="mt-3 text-primary" />
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item
                        className={styles.accordionItem}
                        eventKey="0"
                        onClick={() => handleAllCategory()}
                      >
                        <Link
                          to="/products"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span className={styles.product_span}>All</span>
                        </Link>
                      </Accordion.Item>
                      {categories.map((category) => (
                        <Accordion.Item
                          key={category._id}
                          eventKey={category._id}
                        >
                          <Accordion.Header>
                            {category.category_name}
                          </Accordion.Header>
                          <Accordion.Body>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                              {subcategories
                                .filter((el) => el.category_id === category._id)
                                .map((subcategory) => (
                                  <li
                                    key={subcategory._id}
                                    style={{ margin: "15px 10px" }}
                                  >
                                    <Link
                                      to={`/products/${subcategory._id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                      onClick={() =>
                                        handleClick(subcategory._id)
                                      }
                                      className={styles.accordionButton}
                                    >
                                      {subcategory.subcategory_name}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>

                    <hr className="my-3" />
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="row g-3">
                    {categoryId
                      ? productsfiltre.map((product) => (
                          <Product key={product._id} product={product} />
                        ))
                      : filteredProduct.map((product) => (
                          <Product key={product._id} product={product} />
                        ))}
                  </div>
                  {resPerPage <= count && (
                    <div className="d-flex justify-content-center mt-5">
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
                severity={
                  snackbarMessage.includes("Error") ? "error" : "success"
                }
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
