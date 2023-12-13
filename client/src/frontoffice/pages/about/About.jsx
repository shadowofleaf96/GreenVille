import React, { Fragment } from "react";
import Iconify from "../../../backoffice/components/iconify";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/Navbar";
import { Link } from "react-router-dom";
import MetaData from "../../components/MetaData";
import styles from "./About.module.scss";

const About = () => {
  const abouts = [
    {
      icon: <Iconify icon="material-symbols-light:local-shipping-outline-rounded" width={60} height={60} />,
      title: "Fast and Free Delivery",
      description: "Enjoy swift and complimentary delivery services.",
    },
    {
      icon: <Iconify icon="material-symbols-light:currency-exchange" width={60} height={60} />,
      title: "100% Cash Back Guarantee",
      description: "Shop with confidence knowing you're eligible for a full cash refund.",
    },
    {
      icon: <Iconify icon="material-symbols-light:workspace-premium-outline-rounded" width={60} height={60} />,
      title: "Premium Quality Products",
      description: "Discover excellence with our top-tier, quality-assured products.",
    },
    {
      icon: <Iconify icon="material-symbols-light:perm-phone-msg-outline-rounded" width={60} height={60} />,
      title: "24/7 Customer Support",
      description: "We're here for you around the clock. Contact us anytime for assistance.",
    },
  ];

  return (
    <Fragment>
      <MetaData title={"About"} />
      <Navbar />
      <div className={styles.about}>
        <div className={styles.about_title}>
          <div className="container">
            <h3>About Us</h3>
          </div>
        </div>
        <div className={styles.about_info}>
          <div className="container mb-5">
            <div className="row g-3 p-3">
              <div className="col-md-6">
                <div className={styles.image}>
                  <img
                    src="../../../../public/assets/about.png"
                    alt="About"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={styles.info}>
                  <h4>We are GreenVille</h4>
                  <p>
                    a Collective of young entrepreneurs making their way to the
                    world of E commerce, promoting our local products working
                    in depth with our community
                  </p>
                  <Link to="/contact">
                    <button className="mt-3">Contact Us</button>
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.features}>
              <h3 className="text-center">Our Features</h3>

              <div className="row g-3">
                <div className="col-md-10 col-md-offset-2 mx-auto">
                  <div className="row mt-4">
                    {abouts.map((about, index) => (
                      <div className="col-md-3" key={index}>
                        <div className={styles.feature}>
                          <span>{about.icon}</span>
                          <h5>{about.title}</h5>
                          <p>{about.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default About;
