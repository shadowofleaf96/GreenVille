import React from "react";
import { Link } from "react-router-dom";
import styles from "./Category.module.scss";

const Category = () => {
    const categorys = [
        {
            image: "https://images.unsplash.com/photo-1563865436874-9aef32095fad?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "Vegetables",
            _id: "655c721c82ea0f3d8fc1db2d",
        },
        {
            image: "https://i.pinimg.com/564x/a6/d4/71/a6d4719eec4b10f3c0dc3fc0fae7cc3b.jpg",
            title: "Make-up and Accessories",
            _id: "655c6d0682ea0f3d8fc1db03",
        },
        {
            image: "https://i.pinimg.com/564x/b1/0b/35/b10b35415eda92e675002e12cc9ab769.jpg",
            title: "Eggs & Milk",
            _id: "6570cd56e4122425be4b73e9",
        },
        {
            image: "https://i.pinimg.com/564x/88/36/d9/8836d903f33c8fc7eb4153e59ac9ef01.jpg",
            title: "Honeys",
            _id: "655c6e8d82ea0f3d8fc1db0f",
        },
    ];
    return (
        <div className={styles.category}>
            <div className="container mb-5 mt-5">
                <div className="row g-3">
                    {categorys.map((item, index) => (
                        <div className="col-md-3 text-center" key={index}>
                            <Link to={`/products/${item._id}`} className={styles.item}>
                                <img src={item.image} alt={item.title} />
                                
                                <div>
                                    <h4>{item.title}</h4>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;