"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Iconify from "@/components/shared/iconify";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItemQuantity,
  removeItemFromCart,
} from "@/store/slices/shop/cartSlice";
import MetaData from "@/frontoffice/_components/MetaData";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import optimizeImage from "@/frontoffice/_components/optimizeImage";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Cart = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartItems } = useSelector((state) => state.carts);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customer_access_token")
      : null;

  const removeCartItemHandler = (id, variantId) => {
    dispatch(removeItemFromCart({ productId: id, variantId }));
    toast.success(t("Item Removed Successfully"));
  };

  const increaseQty = (id, quantity, stock, variantId) => {
    const newQty = quantity + 1;
    if (newQty > stock) return;
    dispatch(
      updateCartItemQuantity({ productId: id, quantity: newQty, variantId }),
    );
  };

  const decreaseQty = (id, quantity, variantId) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    dispatch(
      updateCartItemQuantity({ productId: id, quantity: newQty, variantId }),
    );
  };

  const checkoutHandler = () => {
    if (token) {
      router.push("/shipping");
    } else {
      router.push("/login?redirect=/shipping");
    }
  };

  const totalPrice = cartItems
    .reduce(
      (acc, item) => acc + item.quantity * (item.discountPrice || item.price),
      0,
    )
    .toFixed(2);

  const totalUnits = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0,
  );

  return (
    <Fragment>
      <MetaData title={t("Cart")} description={t("CartDescription")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                {t("Shopping Cart")}
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                  {cartItems.length} {t("items in your cart")}
                </p>
              </div>
            </div>

            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => router.push("/products")}
                className="text-xs font-black text-primary uppercase tracking-widest gap-2 hover:bg-primary/5 transition-all"
              >
                <Iconify icon="solar:arrow-left-bold-duotone" width={18} />
                {t("Continue Shopping")}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]"
                >
                  <div className="w-24 h-24 bg-primary/5 text-primary rounded-4xl flex items-center justify-center mb-8">
                    <Iconify
                      icon="solar:cart-large-minimalistic-bold-duotone"
                      width={48}
                    />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 uppercase">
                    {t("Your Cart is Empty")}
                  </h2>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 italic">
                    {t(
                      "Looks like you haven't added anything to your cart yet. Let's find some amazing products!",
                    )}
                  </p>
                  <Button
                    size="lg"
                    onClick={() => router.push("/products")}
                    className="h-16 px-12 rounded-[2.5rem] bg-primary text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 border-none"
                  >
                    <Iconify icon="solar:bag-heart-bold-duotone" width={24} />
                    {t("Start Shopping")}
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.product}-${item.variant?._id || "base"}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group bg-white rounded-4xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Image */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-700">
                          <LazyImage
                            src={
                              typeof item?.image === "string"
                                ? optimizeImage(item?.image, 200)
                                : optimizeImage(item?.image[0], 200)
                            }
                            alt={item.name[currentLanguage]}
                            className="w-full h-full object-contain drop-shadow-xl"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <div className="space-y-1">
                            <Link
                              href={`/product/${item.product}`}
                              className="text-lg font-black text-gray-900 hover:text-primary transition-colors block leading-tight"
                            >
                              {item.name[currentLanguage]}
                            </Link>
                            {item.variant && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-primary/5 text-primary border-primary/20 font-black uppercase tracking-widest"
                              >
                                {item.variant.variant_name}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col pt-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              {t("Unit Price")}
                            </span>
                            <span className="text-xl font-black text-gray-900">
                              {item.discountPrice || item.price}{" "}
                              <span className="text-sm text-primary">
                                {t("DH")}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1 shadow-inner h-12 sm:h-14">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              decreaseQty(
                                item.product,
                                item.quantity,
                                item.variant?._id,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-gray-400 hover:text-primary transition-all"
                          >
                            <Iconify
                              icon="solar:minus-circle-bold-duotone"
                              width={20}
                              className="sm:w-6 sm:h-6"
                            />
                          </Button>
                          <input
                            readOnly
                            value={item.quantity}
                            className="w-10 sm:w-12 bg-transparent text-center font-black text-base sm:text-lg focus:outline-none"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              increaseQty(
                                item.product,
                                item.quantity,
                                item.stock,
                                item.variant?._id,
                              )
                            }
                            disabled={item.quantity >= item.stock}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-gray-400 hover:text-primary transition-all"
                          >
                            <Iconify
                              icon="solar:add-circle-bold-duotone"
                              width={20}
                              className="sm:w-6 sm:h-6"
                            />
                          </Button>
                        </div>

                        {/* Total & Remove */}
                        <div className="flex flex-col items-center sm:items-end gap-4 min-w-30">
                          <div className="text-right flex flex-col items-center sm:items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              {t("Subtotal")}
                            </span>
                            <span className="text-2xl font-black text-primary">
                              {(
                                item.quantity *
                                (item.discountPrice || item.price)
                              ).toFixed(2)}{" "}
                              <span className="text-sm">{t("DH")}</span>
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              removeCartItemHandler(
                                item.product,
                                item.variant?._id,
                              )
                            }
                            className="h-10 px-4 rounded-xl text-red-500 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest gap-2 transition-all"
                          >
                            <Iconify
                              icon="solar:trash-bin-trash-bold-duotone"
                              width={18}
                            />
                            {t("Remove")}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-8">
                  <Card className="rounded-4xl sm:rounded-[3rem] border-none shadow-2xl shadow-gray-200 bg-white overflow-hidden">
                    <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-10">
                      <div className="space-y-4">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                          {t("Order Summary")}
                        </h2>
                        <Separator className="bg-gray-100" />
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-gray-400 uppercase tracking-widest">
                            {t("Items count")}
                          </span>
                          <span className="font-black text-gray-900">
                            {cartItems.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-gray-400 uppercase tracking-widest">
                            {t("Total Units")}
                          </span>
                          <span className="font-black text-gray-900">
                            {totalUnits}
                          </span>
                        </div>
                        <Separator className="bg-gray-50" />
                        <div className="flex justify-between items-end">
                          <span className="font-black text-gray-900 uppercase tracking-widest text-lg">
                            {t("Total Price")}
                          </span>
                          <div className="text-right">
                            <span className="text-3xl font-black text-primary tracking-tight">
                              {totalPrice}{" "}
                              <span className="text-base font-bold">
                                {t("DH")}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Button
                          onClick={checkoutHandler}
                          className="w-full h-16 rounded-4xl bg-primary text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 border-none"
                        >
                          <Iconify
                            icon="solar:bag-check-bold-duotone"
                            width={24}
                          />
                          {t("Proceed to Checkout")}
                        </Button>

                        <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest italic">
                          {t(
                            "Shipping and taxes will be calculated at checkout",
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Badge / Support Info */}
                  <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                      <Iconify
                        icon="solar:shield-check-bold-duotone"
                        width={24}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                        {t("Secure Checkout")}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {t("100% Protection for your data")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;
