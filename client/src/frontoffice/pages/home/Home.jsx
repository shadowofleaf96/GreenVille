import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import Loader from "../../components/loader/Loader";
import MetaData from "../../components/MetaData";
import CTA from "../../../frontoffice/pages/home/cta/CTA"
import Banner from "./banner/Banner";
import Category from "./category/Category";
import Promo from "./promo/Promo";
import Benefits from "./benefits/Benefits"

const Home = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(getProducts());
        }
    }, [dispatch, alert, error]);

    return (
        <Fragment>
            <MetaData title={"Home"} />
            <Banner />
            <Category />
            <hr />
            <CTA />
            <hr />
            {loading ? (
                <>
                    <Loader />
                </>
            ) : (
                <>
                    <Promo products={products} />
                </>
            )}
            <hr />
            <Benefits />
        </Fragment>
    );
};

export default Home;
