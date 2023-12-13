import React, { Fragment } from "react";
import Iconify from "../../../backoffice/components/iconify";
import styles from "./Contact.module.scss";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";

const Contact = () => {
  const contacts = [
    {
      icon: (
        <Iconify
          icon="material-symbols-light:contact-phone-outline-rounded"
          width={72}
          height={72}
        />
      ),
      text1: "Tel: 0608345687",
      text2: "services@greenville.ma",
    },
    {
      icon: (
        <Iconify
          icon="material-symbols-light:contact-phone-outline-rounded"
          width={72}
          height={72}
        />
      ),
      text1: "Tel: 0605545607",
      text2: "email@greenville.ma",
    },
  ];
  return (
    <Fragment>
      <MetaData title={"Contact"} />
      <Navbar />
      <div className={styles.contact}>
        <div className={styles.contact_title}>
          <div className="container">
            <h3>Contact Us</h3>
          </div>
        </div>
        <div className={styles.contact_info}>
          <div className="container mt-5">
            <div className="row g-3">
              <div className="col-md-6">
                <div className={styles.about}>
                  <h4>Information About Us</h4>
                  <p className="mt-3">
                    Moroccan E shop provides all kinds of organic goods, and our
                    services are designed and made to fit into your healthy
                    lifestyles.
                  </p>
                  <div>
                    <span>
                      <Iconify icon="mdi:facebook" width={40} height={40} />
                    </span>
                    <span>
                      <Iconify icon="mdi:instagram" width={40} height={40} />
                    </span>
                    <span>
                      <Iconify icon="mdi:youtube" width={40} height={40} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={styles.contact}>
                  <h4>Contact Way</h4>
                  <div className="row g-3 mt-3">
                    {contacts.map((contact, index) => (
                      <div className="col-md-6" key={index}>
                        <div className="d-flex align-items-center ">
                          <div className="row g-3 mb-3">{contact.icon}</div>
                          <div className="ms-3">
                            <span>{contact.text1}</span>
                            <p>{contact.text2}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contact_form}>
          <div className="container">
            <div className="row g-3">
              <div className="col-md-6">
                <h3>Get In Touch</h3>
                <form className={styles.form}>
                  <div className={styles.from_group}>
                    <label htmlFor="name_field">Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name ..."
                    />
                  </div>
                  <div className={styles.from_group}>
                    <label htmlFor="email_field">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email ..."
                    />
                  </div>
                  <div className={styles.from_group}>
                    <label htmlFor="email_field">Message</label>
                    <textarea
                      placeholder="Enter your text ..."
                      cols="8"
                    ></textarea>
                  </div>

                  <div className={styles.from_group}>
                    <button type="submit">Send</button>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <div className={styles.contact_img}>
                  <img
                    src="../../../../public/assets/contact.png"
                    alt=""
                  />
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

export default Contact;
