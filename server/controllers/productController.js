const Product = require('../models/products');

const homePage = (req, res) => {
    res.send('Hello, Express.js!');
}

const createData = (req, res) => {

    const product = new Product({
        sku: req.body.sku,
        product_image: req.body.product_image,
        product_name: req.body.product_name,
        subcategory_id: req.body.subcategory_id,
        short_description: req.body.short_description,
        price: req.body.price,
        discount_price: req.body.discount_price,
        option: req.body.option,
        active: req.body.active
    })
    product.save()
        .then(result => {
            res.status(201).json(product);
        })
        .catch(err => {
            console.log(err);
        });
}


const searchingItems = async (req, res) => {

    try {
        const { searchQuery, page } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;
        console.log(searchQuery)

        const pipeline = [
            {
                $match: {
                    $or: [
                        { product_name: { $regex: searchQuery, $options: 'i' } },
                    ],
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: 1,
                    product_name: 1,
                    short_description: 1,
                    price: 1,
                    discount_price: 1,
                    categoryName: '$subcategory.category_name',
                    product_image: 1,
                },
            },
        ];

        const products = await Product.aggregate(pipeline);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const RetrievingItems = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    console.log(req.query.page)
    try {
        const productPage = await Product.find()
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json(productPage);
    } catch (error) {
        console.error(error)
    }
}

const categorySub = (req, res) => {
    Product.find({})
        .populate({
            path: 'subcategory_id',
            model: 'Subcategory',
            select: 'subcategory_name',
        })
        .exec((err, product) => {
            if (err) {
            } else {
                console.log(product.subcategory_id.subcategory_name);
            }
        });

}
const RetrieveById = async (req, res) => {
    const id = req.params.id;
    try {

        const productById = await Product.findById(id);

        if (!productById) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json(productById);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateProductById = async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, newData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const DeleteProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(204).json();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    homePage, createData, searchingItems, RetrievingItems, categorySub, RetrieveById, UpdateProductById, DeleteProductById
}



