import Order from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Customer } from "../models/Customer.js";
import { Review } from "../models/Review.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  const isVendor = req.user && req.user.role === "vendor";
  const vendorId = isVendor ? req.user._id : null;

  // Filter for Vendor logic
  let productMatch = {};
  if (isVendor) {
    productMatch = { vendor: new mongoose.Types.ObjectId(vendorId) };
  }

  // 1. Order Status Distribution
  let orderStatusQuery = {};
  if (isVendor) {
    const vendorProducts = await Product.find(productMatch).distinct("_id");
    orderStatusQuery = { "order_items.product_id": { $in: vendorProducts } };
  }

  const orderStatusDistribution = await Order.aggregate([
    { $match: orderStatusQuery },
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $project: { label: "$_id", value: 1, _id: 0 } },
  ]);

  // 2. Top Products (by quantity)
  let topProducts = [];
  if (isVendor) {
    const vendorProducts = await Product.find(productMatch).distinct("_id");
    topProducts = await Order.aggregate([
      { $unwind: "$order_items" },
      { $match: { "order_items.product_id": { $in: vendorProducts } } },
      {
        $group: {
          _id: "$order_items.product_id",
          totalSold: { $sum: "$order_items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products", // Fixed collection name to lowercase 'products' if applicable, or check DB
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.product_name.en",
          totalSold: 1,
          image: { $arrayElemAt: ["$product.product_images", 0] },
          price: "$product.price",
        },
      },
    ]);
  } else {
    topProducts = await Order.aggregate([
      { $unwind: "$order_items" },
      {
        $group: {
          _id: "$order_items.product_id",
          totalSold: { $sum: "$order_items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.product_name.en",
          totalSold: 1,
          image: { $arrayElemAt: ["$product.product_images", 0] },
          price: "$product.price",
        },
      },
    ]);
  }

  // 3. Customer Growth (Last 30 days) - Only for Admin/Manager
  let customerGrowth = [];
  if (!isVendor) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    customerGrowth = await Customer.aggregate([
      { $match: { creation_date: { $gte: thirtyDaysAgo.getTime() } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d/%m",
              date: { $toDate: "$creation_date" },
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { label: "$_id", value: "$count", _id: 0 } },
    ]);
  }

  // 4. Category Sales (Revenue per category)
  let categorySales = [];
  if (isVendor) {
    const vendorProducts = await Product.find(productMatch).distinct("_id");
    categorySales = await Order.aggregate([
      { $unwind: "$order_items" },
      { $match: { "order_items.product_id": { $in: vendorProducts } } },
      {
        $lookup: {
          from: "products",
          localField: "order_items.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "subcategories",
          localField: "product.subcategory_id",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "subcategory.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$category.category_name.en", "Uncategorized"] },
          value: {
            $sum: {
              $multiply: ["$order_items.price", "$order_items.quantity"],
            },
          },
        },
      },
      { $project: { label: "$_id", value: 1, _id: 0 } },
    ]);
  } else {
    categorySales = await Order.aggregate([
      { $unwind: "$order_items" },
      {
        $lookup: {
          from: "products",
          localField: "order_items.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "subcategories",
          localField: "product.subcategory_id",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      { $unwind: { path: "$subcategory", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "subcategory.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$category.category_name.en", "Uncategorized"] },
          value: {
            $sum: {
              $multiply: ["$order_items.price", "$order_items.quantity"],
            },
          },
        },
      },
      { $project: { label: "$_id", value: 1, _id: 0 } },
    ]);
  }

  // 5. Recent Reviews
  let recentReviews = [];
  if (isVendor) {
    const vendorProducts = await Product.find(productMatch).distinct("_id");
    recentReviews = await Review.find({ product_id: { $in: vendorProducts } })
      .sort({ review_date: -1 })
      .limit(5)
      .populate("customer_id", "first_name last_name customer_image")
      .populate("product_id", "product_name.en")
      .lean();
  } else {
    recentReviews = await Review.find()
      .sort({ review_date: -1 })
      .limit(5)
      .populate("customer_id", "first_name last_name customer_image")
      .populate("product_id", "product_name.en")
      .lean();
  }

  // 6. Summary Stats (Total Revenue, Orders, Products, Reviews)
  let totalRevenue = 0;
  let totalOrdersCount = 0;
  let totalProductsCount = 0;
  let totalReviewsCount = 0;

  if (isVendor) {
    const vendorProducts = await Product.find(productMatch).distinct("_id");
    totalProductsCount = vendorProducts.length;

    const revenueStats = await Order.aggregate([
      { $unwind: "$order_items" },
      { $match: { "order_items.product_id": { $in: vendorProducts } } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$order_items.price", "$order_items.quantity"],
            },
          },
          totalOrders: { $addToSet: "$_id" },
        },
      },
    ]);

    if (revenueStats.length > 0) {
      totalRevenue = revenueStats[0].totalRevenue;
      totalOrdersCount = revenueStats[0].totalOrders.length;
    }

    totalReviewsCount = await Review.countDocuments({
      product_id: { $in: vendorProducts },
    });
  } else {
    const revenueAdminStats = await Order.aggregate([
      { $unwind: "$order_items" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$order_items.price", "$order_items.quantity"],
            },
          },
          totalOrders: { $addToSet: "$_id" },
        },
      },
    ]);

    if (revenueAdminStats.length > 0) {
      totalRevenue = revenueAdminStats[0].totalRevenue;
      totalOrdersCount = revenueAdminStats[0].totalOrders.length;
    }

    totalProductsCount = await Product.countDocuments();
    totalReviewsCount = await Review.countDocuments();
  }

  res.status(200).json({
    summary: {
      totalRevenue: totalRevenue || 0,
      totalOrders: totalOrdersCount || 0,
      totalProducts: totalProductsCount || 0,
      totalReviews: totalReviewsCount || 0,
    },
    orderStatusDistribution: orderStatusDistribution || [],
    topProducts: topProducts || [],
    customerGrowth: customerGrowth || [],
    categorySales: categorySales || [],
    recentReviews: recentReviews || [],
  });
};
