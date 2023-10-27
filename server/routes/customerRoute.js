const express = require("express");
const route = express.Router();

const {login, createCustomer, getCustomerById ,getCustomerProfile, getAllCustomers, validateCustomer,updateCustomer,deleteCustomer,logout} = require("../controllers/customerController");

route.post('/login', login);
route.post('', createCustomer);
route.get('/profile', getCustomerProfile);
route.get('', getAllCustomers);
route.get('/:id', getCustomerById);
route.put('/validate/:id', validateCustomer);
route.put('/:id', updateCustomer);
route.delete('/:id/delete', deleteCustomer);
route.post('/logout', logout);

module.exports = route;
