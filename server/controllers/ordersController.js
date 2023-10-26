const Order = require('../models/orders');
const Orders = require('../models/orders');


const CreateOrders = (req, res) => {
    const orders = new Orders({
        customer_id: req.body.customer_id,
        order_items: req.body.order_items,
        order_date: req.body.order_date,
        cart_total_price: req.body.cart_total_price,
        status: req.body.status,
        price: req.body.price,

    })
    console.log(req.body.order_items.blobField);
    orders.save()
        .then(result => {
            res.status(201).json(orders);
        })
        .catch(err => {
            console.log(err);
        });
}

const RetrievingOrders = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    console.log(req.query.page)
    try {
        const productPage = await Order.find()
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json(productPage);
    } catch (error) {
        console.error(error)
    }
}

const searchingOrders = async (req, res) => {
    const id = req.params.id;
    try {

        const orderById = await Order.findById(id);

        if (!orderById) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json(orderById);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateOrdersById = async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    try {
        const updatedORder = await Order.findByIdAndUpdate(id, newData, { new: true });

        if (!updatedORder) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json(updatedORder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { CreateOrders, RetrievingOrders, searchingOrders, UpdateOrdersById }