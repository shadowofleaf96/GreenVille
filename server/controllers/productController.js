// Shadow Of Leaf Was Here

const Product = require("../models/Product");
const { Category } = require("../models/Category");

const createData = (req, res) => {
  const product_image = req.file; // Get the uploaded file from the request
  const {
    sku,
    product_name,
    subcategory_id,
    short_description,
    price,
    discount_price,
    option,
    active,
  } = req.body;

  const product = new Product({
    sku: sku,
    product_image: product_image.path, // Store the file path in the database
    product_name: product_name,
    subcategory_id: subcategory_id,
    short_description: short_description,
    price: price,
    discount_price: discount_price,
    option: option,
    active: active,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json(product);
    })
    .catch((err) => {
      console.log(err);
    });
};

const searchingItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const { searchQuery } = req.query || "";

  try {
    const products = await Product.find({
      product_name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
    })
      .skip(skip)
      .limit(limit)
      .select("product_name product_image price")
      .populate({
        path: "subcategory_id",
        populate: { path: "category_id", select: "category_name" },
      })
      .exec();

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RetrievingItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  console.log(req.query.page);
  try {
    const productPage = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.json(productPage);
  } catch (error) {
    console.error(error);
  }
};

const categorySub = (req, res) => {
  Product.find({})
    .populate({
      path: "subcategory_id",
      model: "Subcategory",
      select: "subcategory_name",
    })
    .exec((err, product) => {
      if (err) {
      } else {
        console.log(product.subcategory_id.subcategory_name);
      }
    });
};
const RetrieveById = async (req, res) => {
  const id = req.params.id;
  try {
    const productById = await Product.findById(id);

    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(productById);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateProductById = async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Product edited successfully",
    });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const DeleteProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createData,
  searchingItems,
  RetrievingItems,
  categorySub,
  RetrieveById,
  UpdateProductById,
  DeleteProductById,
};
