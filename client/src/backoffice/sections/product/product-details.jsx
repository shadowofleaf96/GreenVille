import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Iconify from "../../../components/iconify";
import LazyImage from "../../../components/lazyimage/LazyImage";
import { fDateTime } from "../../../utils/format-time";

const ProductDetailsPopup = ({ product, open, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isActive = product?.status;

  const imageArray =
    typeof product?.product_images === "string"
      ? product?.product_images.split(",")
      : product?.product_images?.[0];

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-4xl border-none shadow-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader className="p-8 pb-4 bg-linear-to-br from-primary/5 via-transparent to-transparent flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-black text-primary tracking-tight uppercase">
            {t("Product Details")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[85vh]">
          <div className="p-8 pt-4 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Image Section */}
              <div className="md:col-span-5 space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-xl group bg-gray-50">
                  <LazyImage
                    src={`${imageArray}`}
                    alt={product?.product_name?.[currentLanguage]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Badge
                    variant={isActive ? "success" : "destructive"}
                    className="px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border-none"
                  >
                    {isActive ? t("Active") : t("Inactive")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary"
                  >
                    {product?.sku}
                  </Badge>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {product?.product_name?.[currentLanguage]}
                  </h3>
                  <p className="text-primary font-bold mt-2">
                    {product?.subcategory?.subcategory_name?.[currentLanguage]}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-4xl border border-gray-100 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Price")}
                    </p>
                    <p className="text-2xl font-black text-primary">
                      {product?.price} DH
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Quantity")}
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      {product?.quantity}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Discount Price")}
                    </p>
                    <p className="text-lg font-bold text-gray-400 line-through decoration-red-400/50">
                      {product?.discount_price || 0} DH
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Options")}
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {product?.option || "-"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Short Description")}
                    </p>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                      &quot;
                      {product?.short_description?.[currentLanguage] ||
                        t("No description available")}
                      &quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Detailed Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <Iconify
                  icon="material-symbols:description-outline-rounded"
                  width={16}
                />
                {t("Extended Details")}
              </div>
              <div className="p-8 rounded-4xl bg-gray-50/30 border border-gray-100/50 text-sm font-medium text-gray-600 leading-relaxed">
                {product?.long_description?.[currentLanguage] ||
                  t("No long description provided")}
              </div>
            </div>

            {/* Variants Section */}
            {product?.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <Iconify
                    icon="material-symbols:layers-outline-rounded"
                    width={16}
                  />
                  {t("Product Variants")}
                </div>
                <div className="rounded-4xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse bg-white">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {t("Name")}
                        </th>
                        <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {t("Price")}
                        </th>
                        <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {t("Quantity")}
                        </th>
                        <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                          {t("SKU")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {product.variants.map((variant, index) => (
                        <tr
                          key={index}
                          className="hover:bg-primary/5 transition-colors group"
                        >
                          <td className="p-4 py-3 text-sm font-bold text-gray-800">
                            {variant.variant_name}
                          </td>
                          <td className="p-4 py-3 text-sm font-black text-primary">
                            {variant.price} DH
                          </td>
                          <td className="p-4 py-3 text-sm font-bold text-gray-600">
                            {variant.quantity}
                          </td>
                          <td className="p-4 py-3 text-[10px] font-black text-gray-400 text-right uppercase tracking-wider">
                            {variant.sku}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Meta Footer */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <Iconify
                    icon="material-symbols:event-available-outline-rounded"
                    width={16}
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                    {t("Created At")}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600">
                    {fDateTime(product?.creation_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end text-right">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                    {t("Last Update")}
                  </p>
                  <p className="text-[11px] font-bold text-gray-600">
                    {fDateTime(product?.last_update)}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                  <Iconify icon="material-symbols:history-rounded" width={16} />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsPopup;
