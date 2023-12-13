import React from "react";
import Iconify from "../../../backoffice/components/iconify";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer_info}>
        <div className="container">
          <div className="row g-3">
            {/* about us  */}
            <div className="col-md-3">
              <div className={styles.about_us}>
                <h5>About Us</h5>
                <div>
                  <p>
                    Moroccan E shop provides all kind of organic goods our
                    services are designed and made to fit to your healthy life
                    styles
                  </p>
                </div>
              </div>
            </div>
            {/* information  */}
            <div className="col-md-3">
              <div className={styles.information}>
                <h5>Information</h5>
                <div>
                  <li>About Us</li>
                  <li>Contact Us</li>
                  <li>FAQs</li>
                  <li>Privacy Policy</li>
                  <li>Refund policy</li>
                  <li>Cookie Policy</li>
                </div>
              </div>
            </div>
            {/* customer service  */}
            <div className="col-md-3">
              <div className={styles.information}>
                <h5>CUSTOMER SERVICE</h5>
                <div>
                  <li>My Account</li>
                  <li>Support Center</li>
                  <li>Terms & Conditions</li>
                  <li>Returns & Exchanges</li>
                  <li>Shipping & Delivery</li>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className={styles.newsletter}>
                <h5>GreenVille NEWSLETTER</h5>
                <div>
                  <p>
                    We Keep updated about every new and interesting items Every
                    week we have something for you
                  </p>
                  <input className="mt-3" type="email" />
                    <Iconify
                      icon="material-symbols-light:alternate-email-rounded"
                      height={35}
                      width={35}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <span>© 2023 GreenVille. All Rights Reserved.</span>
      </div>
    </div>
  );
};

export default Footer;
