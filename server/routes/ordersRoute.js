const express = require('express');
const router = express.Router();
const { CreateOrders, RetrievingOrders, searchingOrders, UpdateOrdersById } = require('../controllers/ordersController')

router.post('/v1/orders', CreateOrders)
router.get('/v1/orders', RetrievingOrders);
router.get('/v1/orders/:id', searchingOrders);
router.put('/v1/orders/:id', UpdateOrdersById)


module.exports = router;