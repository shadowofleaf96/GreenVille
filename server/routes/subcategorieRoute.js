const express = require("express");
const route = express.Router();

const {createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategoryById, deleteSubcategoryById} = require("../controllers/subcategorieController");

route.post('/', createSubcategory);
route.get('/', getAllSubcategories);
route.get('/:id', getSubcategoryById);
route.put('/:id', updateSubcategoryById);
route.delete('/:id', deleteSubcategoryById);


module.exports = route;