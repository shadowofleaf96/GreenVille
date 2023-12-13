import React from "react";
import Iconify from "../../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import styles from "./Promo.module.scss";

const Promo = ({ products, type }) => {
  const scrollRef = React.useRef(null);

  let data;

  switch (type) {
    case "flash sales":
      data = {
        title: "Flash Sales",
        link: "See all",
        filterProperty: "discount_price",
      };
      break;
    case "new arrivals":
      data = {
        title: "New Arrivals",
        link: "See all",
        filterProperty: "creation_date",
      };
      break;
    case "top deals":
      data = {
        title: "Top Deals",
        link: "See all",
        filterProperty: "quantity",
      };
      break;
    default:
      break;
  }

  const scroll = (direction) => {
    const { current } = scrollRef;

    if (direction === "left") {
      current.scrollLeft -= 300;
    } else {
      current.scrollLeft += 300;
    }
  };

  const filteredProducts = products?.filter((product) => {
    switch (type) {
      case "flash sales":
        return product.option.some((opt) => opt.includes("Flash Sales"));
      case "new arrivals":
        return product.option.some((opt) => opt.includes("New Arrivals"));
      case "top deals":
        return product.option.some((opt) => opt.includes("Top Deals"));
      default:
        return true;
    }
  });

  return (
    <div className={styles.fashion}>
      <div className="container mt-3 mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="ms-3">{data.title}</h4>
          <span>
            <Link to={"/products"}>{data.link}</Link>
          </span>
        </div>

        {filteredProducts?.length > 0 && (
          <div className={styles.products_container}>
            <div className={styles.products_container_branch} ref={scrollRef}>
              {filteredProducts.map((product, index) => (
                <div className={styles.item} key={index}>
                  <img
                    src={`http://localhost:3000/${product?.product_image}`}
                    alt={product?.product_name}
                  />
                  <p className="text-center mt-3">
                    <Link to={`/product/${product?._id}`}>
                      {product?.product_name}
                    </Link>
                  </p>
                  <div className="text-center mb-3">
                    {product?.discount_price &&
                    product?.discount_price !== product?.price ? (
                      <div>
                        <div className="text-decoration-line-through">
                          {product?.price}DH
                        </div>
                        <div className="fw-bold">
                          {product?.discount_price} DH
                        </div>
                      </div>
                    ) : (
                      <span className="fw-bold">{product?.price}DH</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.app__gallery_images_arrows}>
        <Iconify
          icon="material-symbols-light:chevron-left-rounded"
          className={styles.gallery_right_arrow_icon}
          onClick={() => scroll("left")}
          width={32}
          height={32}
        />
        <Iconify
          icon="material-symbols-light:chevron-right-rounded"
          className={styles.gallery_left_arrow_icon}
          onClick={() => scroll("right")}
          width={32}
          height={32}
        />
      </div>
    </div>
  );
};

export default Promo;
