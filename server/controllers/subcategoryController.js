const { SubCategory } = require("../models/SubCategory");
const { Product } = require("../models/Product");
const { Category } = require("../models/Category");

const subcategoriesController = {
  async createSubcategory(req, res) {
    let { subcategory_name, category_id, status } = req.body;

    try {
      if (typeof subcategory_name === "string") {
        try {
          subcategory_name = JSON.parse(subcategory_name);
        } catch (error) {
          console.error(error);
        }
      }

      if (typeof status === "string") {
        status = status === "true";
      }

      if (
        !subcategory_name ||
        !subcategory_name.en ||
        !subcategory_name.fr ||
        !subcategory_name.ar
      ) {
        return res.status(400).json({
          error: "Subcategory name must include 'en', 'fr', and 'ar' fields",
        });
      }

      const existingSubcategory = await SubCategory.findOne({
        $or: [
          { "subcategory_name.en": subcategory_name.en },
          { "subcategory_name.fr": subcategory_name.fr },
          { "subcategory_name.ar": subcategory_name.ar },
        ],
      });

      if (existingSubcategory) {
        return res
          .status(400)
          .json({ error: "Subcategory with this name already exists" });
      }

      const newSubcategory = new SubCategory({
        subcategory_name: subcategory_name,
        category_id,
        status: status !== undefined ? status : false,
        subcategory_image: req.file ? req.file.path.replace(/\\/g, "/") : "",
      });

      await newSubcategory.save();

      // Populate category before sending response
      const populatedSubcategory = await SubCategory.findById(
        newSubcategory._id
      )
        .populate("category_id")
        .lean();

      res.status(201).json({
        message: "Subcategory created successfully",
        data: {
          ...populatedSubcategory,
          category: populatedSubcategory.category_id,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Bad request" });
    }
  },
  async getAllSubcategories(req, res) {
    const page = parseInt(req.query.page);
    const perPage = 10;
    const query = req.query.query || "";

    try {
      let queryBuilder = SubCategory.find();

      if (query) {
        queryBuilder = queryBuilder.where(
          "subcategory_name",
          new RegExp(query, "i")
        );
      }

      if (page) {
        queryBuilder = queryBuilder.skip((page - 1) * perPage).limit(perPage);
      }

      const subcategoriesData = await queryBuilder
        .populate("category_id")
        .lean();

      const enrichedSubcategories = subcategoriesData.map((subcategory) => ({
        ...subcategory,
        category: subcategory.category_id || {
          category_name: {
            en: "Deleted Category",
            fr: "Catégorie supprimée",
            ar: "الفئة المحذوفة",
          },
        },
      }));

      res.status(200).json({
        data: enrichedSubcategories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getSubcategoryById(req, res) {
    const SubcategoryId = req.params.id;

    try {
      const subcategory = await SubCategory.findById(SubcategoryId)
        .populate("category_id")
        .lean();

      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      } else {
        res.status(200).json({
          data: subcategory,
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async updateSubcategoryById(req, res) {
    const subcategoryId = req.params.id;
    let { subcategory_name, category_id, status } = req.body;

    if (typeof subcategory_name === "string") {
      try {
        subcategory_name = JSON.parse(subcategory_name);
      } catch (e) {
        // invalid json
      }
    }

    if (typeof status === "string") {
      status = status === "true";
    }

    try {
      const subcategory = await SubCategory.findById(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({ message: "Invalid subcategory ID" });
      }

      if (subcategory_name) {
        if (
          !subcategory_name.en ||
          !subcategory_name.fr ||
          !subcategory_name.ar
        ) {
          return res.status(400).json({
            error: "Subcategory name must include 'en', 'fr', and 'ar' fields",
          });
        }

        subcategory.subcategory_name = subcategory_name;
      }

      if (category_id) {
        subcategory.category_id = category_id;
      }

      if (typeof status !== "undefined") {
        subcategory.status = status;
      }

      if (req.file) {
        subcategory.subcategory_image = req.file.path.replace(/\\/g, "/");
      }

      await subcategory.save();

      // Populate category before sending response
      const populatedSubcategory = await SubCategory.findById(subcategory._id)
        .populate("category_id")
        .lean();

      res.status(200).json({
        message: "Subcategory information updated successfully",
        data: {
          ...populatedSubcategory,
          category: populatedSubcategory.category_id,
        },
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async deleteSubcategoryById(req, res) {
    const SubcategoryId = req.params.id;

    const productsCount = await Product.countDocuments({
      subcategory_id: SubcategoryId,
    });

    try {
      if (productsCount > 0) {
        return res.status(400).json({
          message: "Subcategory cannot be deleted, it has some products",
        });
      }
      const Subcategory = await SubCategory.findOneAndDelete({
        _id: SubcategoryId,
      });

      if (!Subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      return res
        .status(200)
        .json({ message: "Subcategory deleted Successfully" });
    } catch (error) {
      console.error("Deletion error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = subcategoriesController;
