import { useEffect, useState, useCallback, Fragment, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "../../../backoffice/components/iconify";
// Removed Redux fetching actions
import { useProducts } from "../../../services/api/product.queries";
import {
  useCategories,
  useSubcategories,
} from "../../../services/api/category.queries";
import Product from "./Product";
import ProductQuickViewModal from "./ProductQuickViewModal";
import MetaData from "../../components/MetaData";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { subcategory: routeCategoryId } = useParams();

  // 1. Validated Params from URL
  const urlCategory = useMemo(() => {
    const p = searchParams.get("category");
    return p ? p.split(",").map((c) => c.trim()) : [];
  }, [searchParams]);

  const urlSubcategory = useMemo(() => {
    const p = searchParams.get("subcategory");
    return p ? p.split(",").map((s) => s.trim()) : [];
  }, [searchParams]);

  const urlPrice = useMemo(() => {
    const p = searchParams.getAll("price");
    return p.length === 2 ? [Number(p[0]), Number(p[1])] : null;
  }, [searchParams]);

  const urlSortBy = searchParams.get("sortBy") || "creation_date";
  const urlSortOrder = searchParams.get("sortOrder") || "desc";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlKeyword = searchParams.get("keyword") || "";
  const urlOnSale = searchParams.get("sales") !== null;

  // 2. React Query Hooks
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();

  const productsPerPage = 21;

  // Query Params for usage in useProducts
  const queryParams = useMemo(() => {
    const params = {
      page: urlPage,
      limit: productsPerPage,
      minPrice: urlPrice ? urlPrice[0] : 0,
      // Use a very high default if not set, handled by API usually but good to be explicit
      // or let the API handle "undefined" maxPrice
      maxPrice: urlPrice ? urlPrice[1] : 10000,
      search: urlKeyword,
      sortBy: urlSortBy,
      sortOrder: urlSortOrder,
      status: "true",
      onSale: urlOnSale,
    };

    if (urlCategory.length > 0) params.category_id = urlCategory.join(",");
    if (urlSubcategory.length > 0)
      params.subcategory_id = urlSubcategory.join(",");

    return params;
  }, [
    urlPage,
    urlPrice,
    urlKeyword,
    urlSortBy,
    urlSortOrder,
    urlOnSale,
    urlCategory,
    urlSubcategory,
  ]);

  const { data: productsData, isLoading, isError } = useProducts(queryParams);

  const products = productsData?.data || [];
  const total = productsData?.total || 0;
  const apiMaxPrice = productsData?.maxPrice || 10000;

  // 3. UI State (Local) - For price inputs
  const [localMinPrice, setLocalMinPrice] = useState(0);
  const [localMaxPrice, setLocalMaxPrice] = useState(apiMaxPrice);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync Local Price with URL Price or API Max Price on load/change
  useEffect(() => {
    if (urlPrice) {
      setLocalMinPrice(urlPrice[0]);
      setLocalMaxPrice(urlPrice[1]);
    } else if (apiMaxPrice) {
      setLocalMinPrice(0);
      setLocalMaxPrice(apiMaxPrice);
    }
  }, [urlPrice, apiMaxPrice]);

  // Handlers that update URL Params (Source of Truth)
  const updateParams = useCallback(
    (newParams) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(newParams).forEach(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            next.delete(key);
          } else if (Array.isArray(value)) {
            next.delete(key);
            value.forEach((v) => next.append(key, v));
          } else {
            next.set(key, value);
          }
        });
        // Reset page on filter change if not explicitly setting page
        if (!Object.prototype.hasOwnProperty.call(newParams, "page")) {
          next.set("page", 1);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setLocalMinPrice(value === "" ? 0 : Number(value));
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setLocalMaxPrice(value === "" ? apiMaxPrice : Number(value));
  };

  const handlePriceApply = () => {
    setIsFilterOpen(false);

    // Clamp values to valid range
    const clampedMin = Math.max(0, localMinPrice);
    const clampedMax = Math.min(apiMaxPrice, localMaxPrice);

    // Show notification if max price was clamped
    if (localMaxPrice > apiMaxPrice) {
      toast.info(`${t("Maximum price adjusted to")} ${apiMaxPrice} DH`);
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("price");
      next.append("price", clampedMin);
      next.append("price", clampedMax);
      next.set("page", 1);
      return next;
    });
  };

  const handleCategoryToggle = (catId) => {
    const newCategories = urlCategory.includes(catId)
      ? urlCategory.filter((id) => id !== catId)
      : [...urlCategory, catId];
    updateParams({
      category: newCategories.length > 0 ? newCategories.join(",") : null,
    });
  };

  const handleSubcategoryToggle = (subcatId) => {
    const newSubcategories = urlSubcategory.includes(subcatId)
      ? urlSubcategory.filter((id) => id !== subcatId)
      : [...urlSubcategory, subcatId];
    updateParams({
      subcategory:
        newSubcategories.length > 0 ? newSubcategories.join(",") : null,
    });
  };

  const resetFilters = () => {
    setLocalMinPrice(0);
    setLocalMaxPrice(apiMaxPrice);
    setSearchParams(new URLSearchParams()); // Clear all
    setExpandedCategories([]);
  };

  const toggleCategoryExpansion = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const handleSortChange = (value) => {
    let sort = { sortBy: "creation_date", sortOrder: "desc" };
    if (value === "price_asc") sort = { sortBy: "price", sortOrder: "asc" };
    else if (value === "price_desc")
      sort = { sortBy: "price", sortOrder: "desc" };
    else if (value === "rating")
      sort = { sortBy: "average_rating", sortOrder: "desc" };
    else if (value === "name_asc") sort = { sortBy: "name", sortOrder: "asc" };
    else if (value === "name_desc")
      sort = { sortBy: "name", sortOrder: "desc" };

    updateParams(sort);
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", newPage);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickView = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Sync initial route param for category
  useEffect(() => {
    if (routeCategoryId && !searchParams.get("category")) {
      // If coming from a route like /products/category/:id, sync it to params
      // But wait, user might have navigated away.
      // Usually better to let the link set the param?
      // The original code reset category to [routeCategoryId] whenever it changed.
      // If we want to support /products/:subcategory route:
      updateParams({ category: routeCategoryId });
    }
  }, [routeCategoryId, searchParams, updateParams]);

  // Derived state for UI convenience
  // We can just use the url* variables directly in render logic

  return (
    <Fragment>
      <MetaData title={t("Products")} />

      <div className="min-h-screen bg-gray-50/50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar: Title & Sorting */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                {t("Our Catalog")}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-12 bg-primary rounded-full hidden sm:block" />
                <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest italic">
                  {total} {t("Products found")}
                </p>
              </div>
            </div>

            <div className="w-screen -mx-4 px-4 md:w-auto md:mx-0 md:px-0 overflow-hidden">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex flex-wrap items-center gap-3 pb-4 md:pb-2 pr-4 md:pr-0">
                  {[
                    {
                      id: "newest",
                      label: t("Newest"),
                      icon: "solar:star-bold-duotone",
                    },
                    {
                      id: "price_asc",
                      label: t("Price: Low to High"),
                      icon: "solar:course-up-bold-duotone",
                    },
                    {
                      id: "price_desc",
                      label: t("Price: High to Low"),
                      icon: "solar:course-down-bold-duotone",
                    },
                    {
                      id: "rating",
                      label: t("Top Rated"),
                      icon: "solar:medal-ribbon-bold-duotone",
                    },
                    {
                      id: "name_asc",
                      label: t("A-Z"),
                      icon: "solar:letter-bold-duotone",
                    },
                    {
                      id: "name_desc",
                      label: t("Z-A"),
                      icon: "solar:letter-bold-duotone",
                    },
                  ].map((opt) => (
                    <Button
                      key={opt.id}
                      variant={
                        (opt.id === "newest" &&
                          urlSortBy === "creation_date" &&
                          urlSortOrder === "desc") ||
                        (opt.id === "price_asc" &&
                          urlSortBy === "price" &&
                          urlSortOrder === "asc") ||
                        (opt.id === "price_desc" &&
                          urlSortBy === "price" &&
                          urlSortOrder === "desc") ||
                        (opt.id === "rating" &&
                          urlSortBy === "average_rating") ||
                        (opt.id === "name_asc" &&
                          urlSortBy === "name" &&
                          urlSortOrder === "asc") ||
                        (opt.id === "name_desc" &&
                          urlSortBy === "name" &&
                          urlSortOrder === "desc")
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleSortChange(opt.id)}
                      className={`h-10 sm:h-11 px-4 sm:px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 gap-2 border-none shrink-0 ${
                        (opt.id === "newest" &&
                          urlSortBy === "creation_date" &&
                          urlSortOrder === "desc") ||
                        (opt.id === "price_asc" &&
                          urlSortBy === "price" &&
                          urlSortOrder === "asc") ||
                        (opt.id === "price_desc" &&
                          urlSortBy === "price" &&
                          urlSortOrder === "desc") ||
                        (opt.id === "rating" &&
                          urlSortBy === "average_rating") ||
                        (opt.id === "name_asc" &&
                          urlSortBy === "name" &&
                          urlSortOrder === "asc") ||
                        (opt.id === "name_desc" &&
                          urlSortBy === "name" &&
                          urlSortOrder === "desc")
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Iconify
                        icon={opt.icon}
                        width={16}
                        className="sm:w-4.5 sm:h-4.5"
                      />
                      <span className="hidden sm:inline">{opt.label}</span>
                      <span className="sm:hidden text-[10px]">
                        {opt.label === t("Price: Low to High")
                          ? t("Price ↑")
                          : opt.label === t("Price: High to Low")
                            ? t("Price ↓")
                            : opt.label.split(":")[0].split(" ")[0]}
                      </span>
                    </Button>
                  ))}
                  <Button
                    variant={urlOnSale ? "default" : "outline"}
                    onClick={() => {
                      updateParams({ sales: urlOnSale ? null : "true" });
                    }}
                    className={`h-10 sm:h-11 px-4 sm:px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 gap-2 border-none shrink-0 ${
                      urlOnSale
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Iconify
                      icon="solar:sale-bold-duotone"
                      width={16}
                      className="sm:w-4.5 sm:h-4.5"
                    />
                    {t("On Sale")}
                  </Button>
                  {(urlSortBy !== "creation_date" ||
                    urlOnSale ||
                    urlPrice ||
                    urlCategory.length > 0) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        updateParams({
                          sortBy: "creation_date",
                          sortOrder: "desc",
                          sales: null,
                        });
                      }}
                      className="h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-full text-red-500 hover:bg-red-50 shrink-0"
                    >
                      <Iconify
                        icon="solar:close-circle-bold-duotone"
                        width={20}
                        className="sm:w-6 sm:h-6"
                      />
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block space-y-10">
              <div className="sticky top-32 space-y-10">
                {/* Price Filter */}
                <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                      {t("Price Range")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {t("Min")}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={localMinPrice}
                          onChange={handleMinPriceChange}
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {t("Max")}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={localMaxPrice}
                          onChange={handleMaxPriceChange}
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          placeholder={apiMaxPrice.toString()}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handlePriceApply}
                      className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all"
                    >
                      {t("Apply")}
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                    {t("Categories")}
                  </h3>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat._id} className="space-y-3">
                        <div className="flex items-center justify-between group">
                          <div
                            className="flex items-center gap-3 cursor-pointer flex-1"
                            onClick={() => handleCategoryToggle(cat._id)}
                          >
                            <Checkbox
                              id={cat._id}
                              checked={urlCategory.includes(cat._id)}
                              className="w-5 h-5 rounded-lg border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label className="text-sm font-bold text-gray-500 group-hover:text-gray-900 cursor-pointer transition-colors flex-1">
                              {cat.category_name[currentLanguage]}
                            </label>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleCategoryExpansion(cat._id, e)}
                            className="h-8 w-8 rounded-full hover:bg-gray-100 text-gray-400"
                          >
                            <Iconify
                              icon={
                                urlCategory.includes(cat._id) ||
                                expandedCategories.includes(cat._id)
                                  ? "solar:alt-arrow-up-linear"
                                  : "solar:alt-arrow-down-linear"
                              }
                              width={16}
                            />
                          </Button>
                        </div>

                        {/* Nested Subcategories for selected or expanded category */}
                        {(urlCategory.includes(cat._id) ||
                          expandedCategories.includes(cat._id)) && (
                          <div className="pl-8 space-y-2 animate-in slide-in-from-top-2 duration-300">
                            {subcategories
                              .filter((sub) => {
                                const subCatId =
                                  typeof sub.category_id === "object"
                                    ? sub.category_id?._id
                                    : sub.category_id;
                                return subCatId === cat._id;
                              })
                              .map((sub) => (
                                <div
                                  key={sub._id}
                                  className="flex items-center gap-3 group cursor-pointer"
                                  onClick={() =>
                                    handleSubcategoryToggle(sub._id)
                                  }
                                >
                                  <Checkbox
                                    id={sub._id}
                                    checked={urlSubcategory.includes(sub._id)}
                                    className="w-4 h-4 rounded-md border-gray-200 data-[state=checked]:bg-primary/80 data-[state=checked]:border-primary/80"
                                  />
                                  <label className="text-xs font-semibold text-gray-400 group-hover:text-gray-700 cursor-pointer transition-colors flex-1">
                                    {sub.subcategory_name[currentLanguage]}
                                  </label>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full h-14 rounded-2xl border-2 border-red-50 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-600 transition-all gap-3"
                >
                  <Iconify icon="solar:restart-bold-duotone" width={20} />
                  {t("Reset All Filters")}
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3 space-y-12">
              {isError ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-[3rem] p-12 text-center shadow-sm border border-gray-100">
                  <div className="w-24 h-24 bg-red-50 text-red-500 rounded-4xl flex items-center justify-center mb-6">
                    <Iconify
                      icon="solar:bomb-minimalistic-bold-duotone"
                      width={48}
                    />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 uppercase">
                    {t("Oops! Something went wrong")}
                  </h2>
                  <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                    {t(
                      "There was an issue loading the products. Please try again later."
                    )}
                  </p>
                  <Button
                    size="lg"
                    onClick={() => navigate(0)}
                    className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3"
                  >
                    <Iconify icon="solar:refresh-bold-duotone" width={20} />
                    {t("Try Again")}
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white/50 rounded-[3rem] border border-gray-100">
                  <Iconify
                    icon="svg-spinners:90-ring-with-bg"
                    width={64}
                    className="text-primary"
                  />
                  <p className="mt-4 text-gray-400 font-black uppercase tracking-widest text-[10px] italic animate-pulse">
                    {t("Updating catalog...")}
                  </p>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Product
                        product={product}
                        onQuickView={handleQuickView}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-[3rem] p-12 text-center shadow-sm border border-gray-100">
                  <div className="w-24 h-24 bg-primary/5 text-primary rounded-4xl flex items-center justify-center mb-6">
                    <Iconify
                      icon="solar:box-minimalistic-bold-duotone"
                      width={48}
                    />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 uppercase">
                    {t("No products found")}
                  </h2>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8 italic">
                    {t(
                      "Try adjusting your filters or search terms to find what you're looking for."
                    )}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
                    className="h-14 px-10 rounded-2xl text-primary font-black uppercase tracking-widest hover:bg-primary/10 transition-all gap-3"
                  >
                    <Iconify icon="solar:restart-bold-duotone" width={20} />
                    {t("Clear All Filters")}
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {total > productsPerPage && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-10 px-2">
                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(urlPage - 1)}
                    disabled={urlPage === 1}
                    className="h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-full border border-gray-200 text-gray-500 hover:bg-primary transition-colors disabled:opacity-30 group"
                  >
                    <Iconify
                      icon="solar:alt-arrow-left-bold-duotone"
                      width={20}
                      className="sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform"
                    />
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: Math.ceil(total / productsPerPage) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={urlPage === page ? "default" : "ghost"}
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 rounded-2xl font-black text-sm uppercase transition-all duration-300 ${
                          urlPage === page
                            ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110"
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(urlPage + 1)}
                    disabled={urlPage === Math.ceil(total / productsPerPage)}
                    className="h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-full border border-gray-200 text-gray-500 hover:bg-primary transition-colors disabled:opacity-30 group"
                  >
                    <Iconify
                      icon="solar:alt-arrow-right-bold-duotone"
                      width={20}
                      className="sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform"
                    />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Mobile Filter Button */}
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-black text-white shadow-2xl shadow-black/30 hover:scale-105 active:scale-95 transition-all border-none"
              >
                <Iconify icon="solar:filter-bold-duotone" width={24} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[85vh] p-0 rounded-t-[2.5rem] border-none shadow-2xl bg-white"
            >
              <SheetHeader className="p-8 pb-4">
                <SheetTitle className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                  {t("Filters")}
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="h-full max-h-[calc(85vh-180px)] px-8 pb-8 space-y-8">
                {/* Mobile version of sidebars filters */}
                <div className="space-y-8">
                  {/* Price Mobile */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {t("Price Range")}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {t("Min")}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={localMinPrice}
                          onChange={handleMinPriceChange}
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {t("Max")}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={localMaxPrice}
                          onChange={handleMaxPriceChange}
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          placeholder={apiMaxPrice.toString()}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {t("Filter by Catalog")}
                    </h3>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <div key={cat._id} className="space-y-3">
                          <div
                            className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent active:scale-[0.98] transition-all"
                            onClick={() => handleCategoryToggle(cat._id)}
                          >
                            <Checkbox
                              id={`mobile-${cat._id}`}
                              checked={urlCategory.includes(cat._id)}
                              className="w-5 h-5 rounded-md"
                            />
                            <span className="text-sm font-bold text-gray-900">
                              {cat.category_name[currentLanguage]}
                            </span>
                          </div>

                          {/* Mobile Subcategories */}
                          {(urlCategory.includes(cat._id) ||
                            expandedCategories.includes(cat._id)) && (
                            <div className="pl-4 grid grid-cols-1 gap-2 border-l-2 border-gray-100 ml-4 py-2">
                              {subcategories
                                .filter((sub) => {
                                  const subCatId =
                                    typeof sub.category_id === "object"
                                      ? sub.category_id?._id
                                      : sub.category_id;
                                  return subCatId === cat._id;
                                })
                                .map((sub) => (
                                  <div
                                    key={`mobile-sub-${sub._id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-50"
                                    onClick={() =>
                                      handleSubcategoryToggle(sub._id)
                                    }
                                  >
                                    <Checkbox
                                      id={`mobile-sub-${sub._id}`}
                                      checked={urlSubcategory.includes(sub._id)}
                                      className="w-4 h-4 rounded-md"
                                    />
                                    <span className="text-xs font-bold text-gray-500">
                                      {sub.subcategory_name[currentLanguage]}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="absolute bottom-0 left-0 w-full p-6 pt-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-4">
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="h-12 rounded-xl font-black text-red-500 uppercase tracking-widest text-xs hover:bg-red-50 border-none"
                >
                  {t("Reset")}
                </Button>
                <Button
                  onClick={() => {
                    handlePriceApply();
                    setIsFilterOpen(false);
                  }}
                  className="h-12 rounded-xl bg-gray-900 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-black/20"
                >
                  {t("Apply Filters")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ProductQuickViewModal
        open={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
      />
    </Fragment>
  );
};

export default Products;
