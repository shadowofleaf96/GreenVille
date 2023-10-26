const express = require('express');
const router = express.Router();
const {
    homePage, createData, searchingItems, RetrievingItems, categorySub, RetrieveById, UpdateProductById, DeleteProductById
} = require('../controllers/productController')
router.get('/', homePage)
router.post('/products', createData);
router.get('/products', RetrievingItems);
router.get('/products/replace', categorySub);
router.get('/products/search', searchingItems);
router.get('/products/:id', RetrieveById)
router.put('/products/:id', UpdateProductById)
router.delete('/product/:id', DeleteProductById)

module.exports = router;