const { Category } = require("../models/Category");

const createCategory = async (req, res) => {
  // Extract user data from the request body
  const { category_name } = req.body;

  // Create a new user using the create() method
  Category.create({
    category_name,
  })
    .then((newCategory) => {
      // Send a notification email to the user (you need to implement this)
      res.status(201).json({
        status: 201,
        message: "Category created successfully",
      });
    })
    .catch((error) => {
      // Handle any errors that occur during document creation
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Error creating the Category",
      });
    });
};

const getAllCategories = async (req, res, next) => {
  const { page = 1 } = req.query;
  const perPage = 10; // Number of users per page

  // Calculate the skip value to implement pagination
  const skip = (page - 1) * perPage;

  // Define the sorting order based on the "sort" parameter
  try {
    const Users = await Category.find().skip(skip).limit(perPage);
    res.status(200).json({
      status: 200,
      data: Users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const searchCategory = async (req, res, next) => {
  try {
    let { query, page = 1 } = req.query;
    const perPage = 10; // Number of users per page

    // Calculate the skip value to implement pagination
    const skip = (page - 1) * perPage;

    // Build the Mongoose query for searching users
    const searchQuery = {
      $or: [{ category_name: { $regex: new RegExp(query, "i") } }],
    };
    // Build the complete query
    query = Category.find(searchQuery).skip(skip).limit(perPage);
    // Execute the query
    const categories = await query.exec();

    if (categories.length === 0) {
      return res.status(200).json({
        status: 404,
        data: {},
      });
    }

    res.status(200).json({
      status: 200,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getCategoryDetails = async (req, res, next) => {
  const Categories = await Category.find();
  const catId = req.params.id;
  try {
    const matchingCategory = Categories.find((cat) => {
      return cat.id === catId;
    });
    if (matchingCategory) {
      res.status(200).json({
        status: 200,
        data: matchingCategory,
      });
    } else {
      res.status(200).json({
        status: 404,
        message: "No Category found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateCategory = async (req, res) => {
  try {
    const catId = req.params.id; // Get the user's ID from the route parameter
    const { category_name, active } = req.body;
    const invalidFields = [];

    console.log(req.body);
    // Find the existing user by their ID
    const existingCustomer = await Category.findById(catId);

    if (!existingCustomer) {
      return res.status(404).json({
        status: 404,
        message: "Invalid Category id",
      });
    }

    // Validate the request body to ensure data types
    if (typeof category_name !== "string") {
      invalidFields.push("category_name");
    }
    if (typeof active !== "boolean") {
      invalidFields.push("active");
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `Bad request. The following fields have invalid data types: ${invalidFields.join(
          ", "
        )}`,
      });
    }

    existingCustomer.category_name = category_name;
    existingCustomer.active = active;

    await existingCustomer.save();

    res.status(200).json({
      status: 200,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const deleteCategory = async (req, res) => {
  const catId = req.params.id;

  try {
    const existingCategory = await Category.findOneAndDelete({ _id: catId });

    if (!existingCategory) {
      res.status(404).json({
        status: 404,
        message: "Invalid User id",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Category deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createCategory,
  getCategoryDetails,
  getAllCategories,
  searchCategory,
  updateCategory,
  deleteCategory,
};
