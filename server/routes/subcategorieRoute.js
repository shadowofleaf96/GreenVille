const express = require("express");
const route = express.Router();

const {createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategoryById, deleteSubcategoryById} = require("../controllers/subcategorieController");

route.post('/subcategories/', createSubcategory);
route.get('/subcategories/', getAllSubcategories);
route.get('/subcategories/:id', getSubcategoryById);
route.put('/subcategories/:id', updateSubcategoryById);
route.delete('/subcategories/:id', deleteSubcategoryById);


module.exports = route;