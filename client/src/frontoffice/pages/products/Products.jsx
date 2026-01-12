import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "../../../backoffice/components/iconify";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { getCategories } from "../../../redux/frontoffice/categoriesSlice";
import { getSubcategories } from "../../../redux/frontoffice/subcategoriesSlice";
import Product from "./Product";
import ProductQuickViewModal from "./ProductQuickViewModal";
import MetaData from "../../components/MetaData";
import Loader from "../../components/loader/Loader";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { subcategory: routeCategoryId } = useParams();

  const {
    products,
    loading: isLoading,
    error: isError,
    total,
    maxPrice: apiMaxPrice,
  } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { subcategories } = useSelector((state) => state.subcategories);

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 10000]);
  const [committedPrice, setCommittedPrice] = useState([0, 10000]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [sortBy, setSortBy] = useState("creation_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [onSale, setOnSale] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const productsPerPage = 21;

  const fetchProducts = useCallback(() => {
    const keyword = searchParams.get("keyword") || "";
    const params = {
      page: currentPage,
      limit: productsPerPage,
      minPrice: committedPrice[0],
      maxPrice: committedPrice[1],
      search: keyword,
      sortBy,
      sortOrder,
      status: "true",
      onSale,
    };

    if (category.length > 0) {
      params.category_id = category.join(",");
    }

    if (subcategory.length > 0) {
      params.subcategory_id = subcategory.join(",");
    }

    dispatch(getProducts(params));
  }, [
    dispatch,
    currentPage,
    committedPrice,
    category,
    subcategory,
    sortBy,
    sortOrder,
    searchParams,
    onSale,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSubcategories());
  }, [dispatch]);

  // Read params from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    const priceParam = searchParams.getAll("price");

    if (categoryParam) {
      const catArray = categoryParam.split(",").map((c) => c.trim());
      setCategory(catArray);
    }
    if (subcategoryParam) {
      const subCatArray = subcategoryParam.split(",").map((s) => s.trim());
      setSubcategory(subCatArray);
    }
    if (priceParam.length === 2) {
      const p = [Number(priceParam[0]), Number(priceParam[1])];
      setPrice(p);
      setCommittedPrice(p);
    }
  }, [searchParams]);

  // Sync price with apiMaxPrice when it loads
  useEffect(() => {
    if (apiMaxPrice && !searchParams.get("price")) {
      setPrice([0, apiMaxPrice]);
      setCommittedPrice([0, apiMaxPrice]);
    }
  }, [apiMaxPrice, searchParams]);

  const handlePriceChange = (value) => {
    setPrice(value);
  };

  const handlePriceCommit = (value) => {
    setCommittedPrice(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (routeCategoryId) {
      setCategory([routeCategoryId]);
    }
  }, [routeCategoryId]);

  // Check for sales parameter in URL
  useEffect(() => {
    const salesParam = searchParams.get("sales");
    if (salesParam !== null) {
      setOnSale(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (apiMaxPrice && !searchParams.get("maxPrice")) {
      setPrice([0, apiMaxPrice]);
      setCommittedPrice([0, apiMaxPrice]);
    }
  }, [apiMaxPrice]);

  const handleCategoryToggle = (catId) => {
    setCategory((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
    setCurrentPage(1);
  };

  const handleSubcategoryToggle = (subcatId) => {
    setSubcategory((prev) =>
      prev.includes(subcatId)
        ? prev.filter((id) => id !== subcatId)
        : [...prev, subcatId],
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setPrice([0, apiMaxPrice]);
    setCommittedPrice([0, apiMaxPrice]);
    setCategory([]);
    setSubcategory([]);
    setSortBy("creation_date");
    setSortOrder("desc");
    setCurrentPage(1);
    setSortOrder("desc");
    setCurrentPage(1);
    setOnSale(false);
    navigate("/products");
    setExpandedCategories([]);
  };

  const toggleCategoryExpansion = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const handleSortChange = (value) => {
    if (value === "price_asc") {
      setSortBy("price");
      setSortOrder("asc");
    } else if (value === "price_desc") {
      setSortBy("price");
      setSortOrder("desc");
    } else if (value === "newest") {
      setSortBy("creation_date");
      setSortOrder("desc");
    } else if (value === "rating") {
      setSortBy("average_rating");
      setSortOrder("desc");
    } else if (value === "name_asc") {
      setSortBy("name");
      setSortOrder("asc");
    } else if (value === "name_desc") {
      setSortBy("name");
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(total / productsPerPage)) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuickView = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // We keep selectedProduct to avoid jumpy transitions if needed,
    // but usually setting it to null after close is fine.
  }, []);

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
                          sortBy === "creation_date" &&
                          sortOrder === "desc") ||
                        (opt.id === "price_asc" &&
                          sortBy === "price" &&
                          sortOrder === "asc") ||
                        (opt.id === "price_desc" &&
                          sortBy === "price" &&
                          sortOrder === "desc") ||
                        (opt.id === "rating" && sortBy === "average_rating") ||
                        (opt.id === "name_asc" &&
                          sortBy === "name" &&
                          sortOrder === "asc") ||
                        (opt.id === "name_desc" &&
                          sortBy === "name" &&
                          sortOrder === "desc")
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleSortChange(opt.id)}
                      className={`h-10 sm:h-11 px-4 sm:px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 gap-2 border-none shrink-0 ${
                        (opt.id === "newest" &&
                          sortBy === "creation_date" &&
                          sortOrder === "desc") ||
                        (opt.id === "price_asc" &&
                          sortBy === "price" &&
                          sortOrder === "asc") ||
                        (opt.id === "price_desc" &&
                          sortBy === "price" &&
                          sortOrder === "desc") ||
                        (opt.id === "rating" && sortBy === "average_rating") ||
                        (opt.id === "name_asc" &&
                          sortBy === "name" &&
                          sortOrder === "asc") ||
                        (opt.id === "name_desc" &&
                          sortBy === "name" &&
                          sortOrder === "desc")
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
                    variant={onSale ? "default" : "outline"}
                    onClick={() => {
                      setOnSale(!onSale);
                      setCurrentPage(1);
                    }}
                    className={`h-10 sm:h-11 px-4 sm:px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 gap-2 border-none shrink-0 ${
                      onSale
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
                  {(sortBy !== "creation_date" || onSale) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSortBy("creation_date");
                        setSortOrder("desc");
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
                    <Badge
                      variant="outline"
                      className="text-[10px] font-black border-primary/20 text-primary uppercase"
                    >
                      {price[0]}DH - {price[1]}DH
                    </Badge>
                  </div>
                  <Slider
                    defaultValue={[0, apiMaxPrice]}
                    max={apiMaxPrice}
                    step={10}
                    value={price}
                    onValueChange={handlePriceChange}
                    onValueCommit={handlePriceCommit}
                    className="py-4"
                  />
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
                              checked={category.includes(cat._id)}
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
                                category.includes(cat._id) ||
                                expandedCategories.includes(cat._id)
                                  ? "solar:alt-arrow-up-linear"
                                  : "solar:alt-arrow-down-linear"
                              }
                              width={16}
                            />
                          </Button>
                        </div>

                        {/* Nested Subcategories for selected or expanded category */}
                        {(category.includes(cat._id) ||
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
                                    checked={subcategory.includes(sub._id)}
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
                      "There was an issue loading the products. Please try again later.",
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
                      "Try adjusting your filters or search terms to find what you're looking for.",
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
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
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
                      (_, i) => i + 1,
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`h-8 w-8 rounded-2xl font-black text-sm uppercase transition-all duration-300 ${
                          currentPage === page
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
                    onClick={handleNextPage}
                    disabled={
                      currentPage === Math.ceil(total / productsPerPage)
                    }
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
                      <span className="text-sm font-black text-primary">
                        {price[0]}DH - {price[1]}DH
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, apiMaxPrice]}
                      max={apiMaxPrice}
                      step={100}
                      value={price}
                      onValueChange={handlePriceChange}
                      onValueCommit={handlePriceCommit}
                      className="py-4"
                    />
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
                              checked={category.includes(cat._id)}
                              className="w-5 h-5 rounded-md"
                            />
                            <span className="text-sm font-bold text-gray-900">
                              {cat.category_name[currentLanguage]}
                            </span>
                          </div>

                          {/* Mobile Subcategories */}
                          {(category.includes(cat._id) ||
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
                                      checked={subcategory.includes(sub._id)}
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
                  onClick={() => setIsFilterOpen(false)}
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
