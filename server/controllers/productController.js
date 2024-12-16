// Shadow Of Leaf Was Here

const { Product } = require("../models/Product");
const { SubCategory } = require("../models/SubCategory");
const { Category } = require("../models/Category");

const createData = async (req, res) => {
  const product_images = req.files;

  if (!product_images || product_images.length === 0) {
    return res.status(400).json({ message: "No images uploaded." });
  }

  const imagePaths = product_images.map((file) => file.path);

  const {
    sku,
    product_name,
    subcategory_id,
    short_description,
    long_description,
    price,
    discount_price,
    option,
    quantity,
    active,
  } = req.body;

  const processedOption = Array.isArray(option) ? option[0] : option;

  const product = new Product({
    sku,
    product_images: imagePaths,
    subcategory_id,
    product_name,
    short_description,
    long_description,
    price,
    discount_price,
    option: processedOption,
    quantity,
    active,
  });

  product
    .save()
    .then((data) => {
      res.status(201).json({
        message: "Product created successfully",
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error creating product" });
    });
};

const searchingItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const { searchQuery } = req.query || "";

  try {
    const products = await Product.find({
      product_name: { $regex: searchQuery, $options: "i" },
    })
      .skip(skip)
      .limit(limit)
      .select("product_name product_images price")
      .populate({
        path: "subcategory_id",
        populate: { path: "category_id", select: "category_name" },
      })
      .exec();

    res.status(201).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RetrievingItems = async (req, res) => {
  const page = parseInt(req.query.page);
  const perPage = 10;

  try {
    let query = Product.find().lean();

    if (page) {
      query = query.skip((page - 1) * perPage).limit(perPage);
    }

    const productPage = await query;

    const subcategoryPromises = productPage.map((product) =>
      SubCategory.findById(product.subcategory_id).lean()
    );
    const subcategories = await Promise.all(subcategoryPromises);

    const enrichedProducts = productPage.map((product, index) => {
      const subcategory = subcategories[index];
      return {
        ...product,
        subcategory: subcategory,
      };
    });

    res.status(201).json({
      data: enrichedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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

    res.status(200).json({
      data: productById,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateProductById = async (req, res) => {
  const id = req.params.id;
  const product_images = req.files;
  let fixed_product_images;
  const newData = req.body;

  newData.last_update = Date.now();

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Invalid product id" });
  }

  if (product_images && product_images.length > 0) {
    fixed_product_images = product_images.map((file) =>
      file.path.replace(/public\\/g, "")
    );
  } else {
    fixed_product_images = product.product_images;
  }

  const updateData = {
    product_images: fixed_product_images,
    ...newData,
  };

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Product edited successfully",
      data: updatedProduct,
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
