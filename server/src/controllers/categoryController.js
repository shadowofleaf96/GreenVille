import { Category } from "../models/Category.js";
import { SubCategory } from "../models/SubCategory.js";

export const createCategory = async (req, res) => {
  let { category_name, status } = req.body;

  if (typeof category_name === "string") {
    try {
      category_name = JSON.parse(category_name);
    } catch (error) {
      console.error(error);
    }
  }

  if (typeof status === "string") {
    status = status === "true";
  }

  if (
    !category_name ||
    !category_name.en ||
    !category_name.fr ||
    !category_name.ar
  ) {
    return res.status(400).json({
      error: "Category name must include 'en', 'fr', and 'ar' fields",
    });
  }

  try {
    const existingCategory = await Category.findOne({
      $or: [
        { "category_name.en": category_name.en },
        { "category_name.fr": category_name.fr },
        { "category_name.ar": category_name.ar },
      ],
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    const newCategory = new Category({
      category_name: category_name,
      status: status || false,
      category_image: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    await newCategory.save();

    res.status(200).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating the Category",
    });
  }
};

export const getAllCategories = async (req, res) => {
  const { page } = req.query;
  const perPage = 10;

  const skip = (page - 1) * perPage;

  if (page) {
    try {
      const Categories = await Category.find().skip(skip).limit(perPage).lean();
      res.status(200).json({
        data: Categories,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    try {
      const Categories = await Category.find().lean();
      res.status(200).json({
        data: Categories,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
};

export const searchCategory = async (req, res) => {
  try {
    let { query, page = 1 } = req.query;
    const perPage = 10;

    const skip = (page - 1) * perPage;

    const searchQuery = {
      $or: [{ category_name: { $regex: new RegExp(query, "i") } }],
    };
    const categoriesQuery = Category.find(searchQuery)
      .skip(skip)
      .limit(perPage)
      .lean();
    const categories = await categoriesQuery.exec();

    if (categories.length === 0) {
      return res.status(404).json({
        data: {},
      });
    }

    res.status(200).json({
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCategoryDetails = async (req, res) => {
  const catId = req.params.id;
  try {
    const matchingCategory = await Category.findById(catId).lean();

    if (matchingCategory) {
      res.status(200).json({
        data: matchingCategory,
      });
    } else {
      res.status(404).json({
        message: "No Category found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const updateCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    let { category_name, status } = req.body;
    const invalidFields = [];

    if (typeof category_name === "string") {
      try {
        category_name = JSON.parse(category_name);
      } catch (e) {
        console.error(e);
      }
    }

    if (typeof status === "string") {
      status = status === "true";
    }

    if (
      !category_name ||
      !category_name.en ||
      !category_name.fr ||
      !category_name.ar
    ) {
      return res.status(400).json({
        message: "Category name must include 'en', 'fr', and 'ar' fields",
      });
    }

    const existingCategory = await Category.findById(catId);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (
      category_name &&
      (typeof category_name.en !== "string" ||
        typeof category_name.fr !== "string" ||
        typeof category_name.ar !== "string")
    ) {
      invalidFields.push("category_name");
    }

    if (typeof status !== "undefined" && typeof status !== "boolean") {
      invalidFields.push("status");
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Bad request. The following fields have invalid data types: ${invalidFields.join(
          ", ",
        )}`,
      });
    }

    const parsedCategoryName = category_name;

    existingCategory.category_name = parsedCategoryName;
    if (typeof status !== "undefined") {
      existingCategory.status = status;
    }
    if (req.file) {
      existingCategory.category_image = req.file.path.replace(/\\/g, "/");
    }

    await existingCategory.save();

    res.status(200).json({
      message: "Category updated successfully",
      data: existingCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const catCount = await SubCategory.countDocuments({
    category_id: categoryId,
  });
  try {
    if (catCount > 0) {
      return res.status(400).json({
        message: "Category cannot be deleted, it has some subCategories",
      });
    }
    const category = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (!category) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    return res.status(200).json({ message: "Subcategory deleted" });
  } catch (error) {
    console.error("Deletion error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
