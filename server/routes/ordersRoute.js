const express = require('express');
const router = express.Router();
const { CreateOrders, RetrievingOrders, searchingOrders, UpdateOrdersById } = require('../controllers/ordersController')

router.post('/orders', CreateOrders)
router.get('/orders', RetrievingOrders);
router.get('/orders/:id', searchingOrders);
router.put('/orders/:id', UpdateOrdersById)


module.exports = router;