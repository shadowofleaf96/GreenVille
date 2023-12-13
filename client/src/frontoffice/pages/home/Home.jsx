import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/Navbar";
import Loader from "../../components/loader/Loader";
import MetaData from "../../components/MetaData";
import Banner from "./banner/Banner";
import Category from "./category/Category";
import Promo from "./promo/Promo";

const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);

    useEffect(() => {

        dispatch(getProducts());
    }, [dispatch, alert, error]);

    return (
        <Fragment>
            <MetaData title={"Home"} />
            <Navbar />
            <Banner />
            <Category />
            {loading ? (
                <>
                    <Loader />
                </>
            ) : (
                <>
                    <Promo products={products} type="flash sales" />
                    <Promo products={products} type="new arrivals" />
                    <Promo products={products} type="top deals" />
                </>
            )}

            <Footer />
        </Fragment>
    );
};

export default Home;
