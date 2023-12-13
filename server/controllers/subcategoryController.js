const subcategories = require("../models/SubCategory");
const Product = require("../models/Product");
const { Category } = require("../models/Category");

const subcategoriesController = {
  async createSubcategory(req, res) {
    //Create a new subcategory
    const { subcategory_name, category_id } = req.body;

    try {
      // Check if the subcategory name is unique
      const existingSubcategory = await subcategories.findOne({
        subcategory_name,
      });

      if (existingSubcategory) {
        return res
          .status(400)
          .json({ error: "Subcategory with this name already exists" });
      }

      // Create a new subcategory with the provided data
      const newSubcategory = new subcategories({
        subcategory_name,
        category_id,
        active: false, // Set the default value to false
      });

      // Save the new subcategory to the database
      await newSubcategory.save();

      res.status(201).json({
        message: "Subcategory created successfully",
        data: newSubcategory,
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
      let queryBuilder = subcategories.find();

      if (query) {
        queryBuilder = queryBuilder.where(
          "subcategory_name",
          new RegExp(query, "i")
        );
      }

      if (page) {
        queryBuilder = queryBuilder.skip((page - 1) * perPage).limit(perPage);
      }

      const subcategoriesData = await queryBuilder.lean();

      if (subcategoriesData.length === 0) {
        return res.status(200).json([]);
      }

      const categoryPromises = subcategoriesData.map((subcategory) =>
        Category.findById(subcategory.category_id).lean()
      );
      const categories = await Promise.all(categoryPromises);

      const enrichedSubcategories = subcategoriesData.map(
        (subcategory, index) => ({
          ...subcategory,
          category: categories[index],
        })
      );

      res.status(200).json({
        data: enrichedSubcategories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getSubcategoryById(req, res) {
    //Get a subcategory by ID
    const SubcategoryId = req.params.id;

    try {
      const subcategory = await subcategories.findById(SubcategoryId).lean();

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
    //Update the subcategory data
    const subcategoryId = req.params.id;
    const { subcategory_name, category_id, active } = req.body;

    try {
      const subcategory = await subcategories.findById(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({ message: "Invalid subcategory id" });
      }

      if (subcategory_name) {
        subcategory.subcategory_name = subcategory_name;
      }

      if (category_id) {
        subcategory.category_id = category_id;
      }

      if (active) {
        subcategory.active = active;
      }

      await subcategory.save();

      res.status(200).json({
        message: "Subcategory information updated",
        data: subcategory,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async deleteSubcategoryById(req, res) {
    //Delete a subcategory
    const SubcategoryId = req.params.id;

    // try {
    const productsCount = await Product.countDocuments({
      subcategory_id: SubcategoryId,
    });

    try {
      if (productsCount > 0) {
        return res.status(400).json({
          message: "Subcategory cannot be deleted, it has some products",
        });
      }
      const Subcategory = await subcategories.findOneAndRemove({
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
