import React, { useState, useMemo, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import Iconify from "../../../backoffice/components/iconify";
import { addItemToCart } from "../../../redux/frontoffice/cartSlice";
import optimizeImage from "../../components/optimizeImage";
import LazyImage from "../../../components/lazyimage/LazyImage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Memoized Helper Component for Variant Item
const VariantItem = memo(
  ({
    variant,
    isSelected,
    quantity,
    isOutOfStock,
    onToggle,
    onQuantityChange,
    t,
  }) => {
    return (
      <motion.div
        whileHover={!isOutOfStock ? { y: -4 } : {}}
        onClick={() => !isOutOfStock && onToggle(variant._id)}
        className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
          isSelected
            ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
            : "border-gray-100 bg-white hover:border-primary/20 hover:shadow-lg"
        } ${
          isOutOfStock
            ? "opacity-50 grayscale cursor-not-allowed border-gray-100 bg-gray-50"
            : ""
        }`}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
            <Iconify icon="solar:check-circle-bold" width={16} />
          </div>
        )}

        {/* Out of Stock Label */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 backdrop-blur-[1px]">
            <Badge
              variant="destructive"
              className="font-black uppercase tracking-widest text-[10px] px-3 py-1"
            >
              {t("Out of Stock")}
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <p
              className="font-black text-gray-900 text-sm tracking-tight truncate pr-6"
              title={variant.variant_name}
            >
              {variant.variant_name}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-primary">
                {variant.price}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t("DH")}
              </span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {t("Stock")}: {variant.quantity}
            </p>
          </div>

          {isSelected && !isOutOfStock && (
            <div className="space-y-3 pt-2 animate-in slide-in-from-bottom-2 duration-300">
              <div
                className="flex items-center justify-between p-1 bg-white rounded-2xl border border-gray-100 shadow-inner"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => onQuantityChange(e, variant._id, -1)}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-xl text-primary hover:bg-primary/10 focus:ring-0"
                >
                  <Iconify icon="solar:minus-circle-bold-duotone" width={20} />
                </Button>
                <span className="text-sm font-black text-gray-900">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => onQuantityChange(e, variant._id, 1)}
                  disabled={quantity >= variant.quantity}
                  className="h-8 w-8 rounded-xl text-primary hover:bg-primary/10 focus:ring-0"
                >
                  <Iconify icon="solar:add-circle-bold-duotone" width={20} />
                </Button>
              </div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest text-right">
                {t("Subtotal")}: {(variant.price * quantity).toFixed(2)}{" "}
                {t("DH")}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.quantity === nextProps.quantity &&
      prevProps.isOutOfStock === nextProps.isOutOfStock &&
      prevProps.variant._id === nextProps.variant._id
    );
  },
);

const ProductQuickViewModal = ({ open, onClose, product }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [variantSelections, setVariantSelections] = useState({});

  const handleVariantToggle = useCallback((variantId) => {
    setVariantSelections((prev) => ({
      ...prev,
      [variantId]: {
        selected: !prev[variantId]?.selected,
        quantity: prev[variantId]?.quantity || 1,
      },
    }));
  }, []);

  const handleQuantityChange = useCallback((e, variantId, delta) => {
    e.stopPropagation();
    setVariantSelections((prev) => {
      const currentQty = prev[variantId]?.quantity || 1;
      const newQty = currentQty + delta;

      return {
        ...prev,
        [variantId]: {
          ...prev[variantId],
          quantity: newQty,
        },
      };
    });
  }, []);

  const handleQuantityChangeSafe = useCallback(
    (e, variantId, delta) => {
      e.stopPropagation();
      const variant = product?.variants?.find((v) => v._id === variantId);
      if (!variant) return;

      setVariantSelections((prev) => {
        const currentQty = prev[variantId]?.quantity || 1;
        const newQty = Math.max(
          1,
          Math.min(currentQty + delta, variant.quantity),
        );

        if (newQty < 1 || newQty > variant.quantity) return prev;

        return {
          ...prev,
          [variantId]: {
            ...prev[variantId],
            quantity: newQty,
          },
        };
      });
    },
    [product],
  );

  const handleAddToCart = useCallback(() => {
    const selectedVariants = Object.entries(variantSelections)
      .filter(([_, data]) => data.selected)
      .map(([variantId, data]) => ({ variantId, quantity: data.quantity }));

    if (selectedVariants.length === 0) {
      toast.error(t("Please select at least one variant"));
      return;
    }

    selectedVariants.forEach(({ variantId, quantity }) => {
      dispatch(
        addItemToCart({
          id: product._id,
          quantity: quantity,
          variantId: variantId,
        }),
      );
    });

    toast.success(t("itemAdded"));
    onClose();
    setVariantSelections({});
  }, [variantSelections, product, dispatch, t, onClose]);

  const imageSrc = useMemo(() => {
    if (Array.isArray(product?.product_images)) {
      return `${optimizeImage(product?.product_images[0], 600)}`;
    } else if (typeof product?.product_images === "string") {
      return `${optimizeImage(product?.product_images, 600)}`;
    } else {
      return "/assets/image_placeholder.png";
    }
  }, [product?.product_images]);

  const selectedTotal = useMemo(() => {
    return Object.entries(variantSelections)
      .filter(([_, data]) => data.selected)
      .reduce((total, [variantId, data]) => {
        const variant = product?.variants?.find((v) => v._id === variantId);
        return total + (variant?.price || 0) * data.quantity;
      }, 0);
  }, [variantSelections, product?.variants]);

  const selectedCount = useMemo(() => {
    return Object.values(variantSelections).filter((data) => data.selected)
      .length;
  }, [variantSelections]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
        <DialogHeader className="p-8 pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
              {product?.product_name?.[currentLanguage]}
            </DialogTitle>
            <DialogDescription className="text-xs font-black text-primary uppercase tracking-widest italic">
              {product?.category?.category_name?.[currentLanguage] ||
                t("Select Options")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="p-8 space-y-8">
            {/* Product Overview Section */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 h-64 bg-gray-50/50 rounded-3xl p-4 flex items-center justify-center border border-gray-100 shadow-inner group">
                <LazyImage
                  src={imageSrc}
                  alt={product?.product_name?.[currentLanguage]}
                  className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 space-y-6">
                {product?.short_description?.[currentLanguage] && (
                  <div className="p-5 bg-primary/5 rounded-2xl border-l-4 border-primary">
                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                      "{product.short_description[currentLanguage]}"
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Base Price")}
                    </span>
                    {product?.on_sale && (
                      <Badge className="bg-red-500 text-white border-none px-2 py-0.5 rounded-full font-black uppercase tracking-widest text-[8px]">
                        {t("Sale")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      {product?.on_sale && product?.discount_price
                        ? product.discount_price
                        : product?.price}{" "}
                      {t("DH")}
                    </span>
                    {product?.on_sale && product?.discount_price && (
                      <span className="text-sm font-bold text-gray-400 line-through">
                        {product.price} {t("DH")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Variant Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                  {t("Available Options")}
                </h3>
                {selectedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full uppercase tracking-widest text-[10px]"
                  >
                    {selectedCount} {t("selected")}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product?.variants?.map((variant) => {
                  const isSelected = !!variantSelections[variant._id]?.selected;
                  const quantity =
                    variantSelections[variant._id]?.quantity || 1;
                  const isOutOfStock = variant.quantity <= 0;

                  return (
                    <VariantItem
                      key={variant._id}
                      variant={variant}
                      isSelected={isSelected}
                      quantity={quantity}
                      isOutOfStock={isOutOfStock}
                      onToggle={handleVariantToggle}
                      onQuantityChange={handleQuantityChangeSafe}
                      t={t}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with Total and Add to Cart */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 backdrop-blur-[1px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {t("Order Summary")} ({selectedCount} {t("selected")})
              </span>
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                {selectedTotal.toFixed(2)}{" "}
                <span className="text-lg text-primary">{t("DH")}</span>
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={selectedCount === 0}
              className="w-full sm:w-auto h-16 px-12 rounded-3xl bg-primary text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 gap-3 border-none"
            >
              <Iconify
                icon="solar:cart-large-minimalistic-bold-duotone"
                width={24}
              />
              {selectedCount === 0 ? t("Select Options") : t("Add to Cart")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickViewModal;
