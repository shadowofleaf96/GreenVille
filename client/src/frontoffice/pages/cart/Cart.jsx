import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import Iconify from "../../../backoffice/components/iconify";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQuantity,
  removeItemFromCart,
} from "../../../redux/frontoffice/cartSlice";
import MetaData from "../../components/MetaData";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const backend = import.meta.env.VITE_BACKEND_URL;

const Cart = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language
  const dispatch = useDispatch();
  const history = useNavigate();
  const { cartItems } = useSelector((state) => state.carts);
  const token = localStorage.getItem('customer_access_token');

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
    toast.success(t("Item Removed Successfully"));
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) return;

    dispatch(updateCartItemQuantity({ productId: id, quantity: newQty }));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;

    dispatch(updateCartItemQuantity({ productId: id, quantity: newQty }));
  };

  const checkoutHandler = () => {
    if (token) {
      history("/shipping");
    } else {
      history("/login?redirect=/shipping");
    }
  };
  
  return (
    <Fragment>
      <MetaData title={t("Cart")} />
      <div className="min-h-screen flex flex-col mt-8 px-4">
        <div className="container mx-auto grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="p-4 bg-white shadow rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold">{t("Shopping Cart")}</h4>
                <h4 className="text-lg">{`${cartItems.length} ${t("items")}`}</h4>
              </div>
              <hr />
              <div className="container mx-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <Iconify className="mb-2" icon="mdi:shopping" width={100} height={100} />
                    <h2 className="text-2xl font-semibold mb-2">{t("Your Cart is Empty")}</h2>
                    <p className="text-gray-600 mb-6">{t("Looks like you haven't added anything to your cart yet.")}</p>
                    <Link
                      to="/products"
                      className="bg-[#8DC63F] text-white px-6 py-3 rounded-lg hover:bg-yellow-500 transition duration-300"
                    >
                      {t("Start Shopping")}
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <Fragment key={item.product}>
                      <div className="flex flex-col md:flex-row items-center gap-4 my-4">
                        <img
                          src={typeof item?.image === "string" ? `${item?.image}` : `${item?.image[0]}`}
                          alt={item.name[currentLanguage]}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <Link to={`/product/${item.product}`} className="text-blue-500 hover:underline">
                            {item.name[currentLanguage]}
                          </Link>
                          <p className="text-green-400 font-semibold flex justify-center md:justify-start text-lg mt-2">
                            {item.discountPrice} DH
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.product, item.quantity)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-red-500 hover:text-white"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center rounded-lg bg-white border border-green-400"
                          />
                          <button
                            onClick={() => increaseQty(item.product, item.quantity, item.stock)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-green-500 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeCartItemHandler(item.product)}
                          className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-red-600"
                        >
                          {t("Remove")}
                        </button>
                      </div>
                      <hr />
                    </Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="h-60 order_summary p-4 bg-white shadow rounded-lg">
            <h4 className="text-lg font-bold mb-4">{t("Order Summary")}</h4>
            <hr />
            <p className="flex justify-between my-2">
              <span>{t("Subtotal")}</span>
              <span>{cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)} {t("Units or KG")}</span>
            </p>
            <p className="font-semibold flex justify-between my-2">
              <span>{t("Total Price")}</span>
              <span>{cartItems.reduce((acc, item) => acc + item.quantity * item.discountPrice, 0).toFixed(2)} DH</span>
            </p>
            <hr />
            {cartItems.length !== 0 ? (
              <div className="text-center mt-4">
                <button onClick={checkoutHandler} className="bg-[#8DC63F] text-white py-3 px-8 rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-600">
                  {t("Checkout")}
                </button>
              </div>
            ) : (
              <div className="text-center mt-4">
                <button disabled onClick={checkoutHandler} className="bg-gray-100 py-3 px-8 text-gray-400 rounded-md">
                  {t("Checkout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;
